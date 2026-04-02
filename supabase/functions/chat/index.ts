import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ChatMessage = {
  role: string;
  content: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const jsonResponse = (body: Record<string, string>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const rawMessages = Array.isArray(payload?.messages) ? payload.messages : [];
    const messages: ChatMessage[] = rawMessages
      .filter(
        (message): message is ChatMessage =>
          typeof message?.role === "string" && typeof message?.content === "string"
      )
      .map((message) => ({
        role: message.role,
        content: message.content.trim(),
      }))
      .filter((message) => message.content.length > 0);
    const context =
      payload?.context && typeof payload.context === "object" && !Array.isArray(payload.context)
        ? payload.context
        : {};
    const systemOverride = typeof payload?.systemOverride === "string" ? payload.systemOverride : "";
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");

    if (messages.length === 0) {
      return jsonResponse({ error: "A message is required to start the chat." }, 400);
    }

    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured");
    }

    let customPrompt = "";
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(supabaseUrl, supabaseKey);
      const { data } = await sb
        .from("admin_settings")
        .select("value")
        .eq("key", "ai_system_prompt")
        .single();

      if (data?.value) {
        customPrompt = data.value;
      }
    } catch {
      // Fall back to the default prompt when admin settings are unavailable.
    }

    const userLang = typeof context?.language === "string" ? context.language : "en";
    const langInstruction =
      userLang !== "en"
        ? `\nIMPORTANT: Respond in the language with code "${userLang}". Always respond in this language unless the user explicitly asks otherwise.`
        : "";

    const defaultPrompt = `You are Bee, the friendly AI assistant for BizHive - India's business growth platform. You are an expert on Indian business startup, legal compliance, taxation, funding, and growth.

User Context:
${JSON.stringify(context, null, 2)}

Guidelines:
- Be friendly, concise, and actionable
- Tailor advice to the user's business stage, industry, and location
- Reference Indian regulations, schemes, and market conditions
- If the user is on a specific page, relate your answers to that context
- Use markdown formatting for clarity${langInstruction}`;

    const systemPrompt = systemOverride.trim() || customPrompt || defaultPrompt;

    const allMessages = [
      { role: "user", parts: [{ text: `System instructions: ${systemPrompt}` }] },
      { role: "model", parts: [{ text: "Understood. I will follow these instructions." }] },
      ...messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
    ];

    const modelName = Deno.env.get("GEMINI_MODEL")?.trim() || "gemini-2.5-flash-lite";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: allMessages }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);

      const isRateLimit = response.status === 429;
      return jsonResponse({ error: isRateLimit ? "Rate limits exceeded" : "AI API error" }, isRateLimit ? 429 : 500);
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);

            if (!line.startsWith("data: ")) {
              continue;
            }

            const jsonStr = line.slice(6);

            try {
              const parsed = JSON.parse(jsonStr);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;

              if (!text) {
                continue;
              }

              const openaiChunk = {
                choices: [{ delta: { content: text } }],
              };
              await writer.write(encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
            } catch {
              // Ignore malformed Gemini chunks and keep the stream alive.
            }
          }
        }

        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } catch (error) {
        console.error("Stream error:", error);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in chat function:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
