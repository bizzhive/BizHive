import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ChatMessage = {
  role: string;
  content: string;
};

type GeminiMessage = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

const MAX_HISTORY_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_SYSTEM_PROMPT_LENGTH = 4000;
const MAX_OUTPUT_TOKENS = 512;

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

const truncateText = (value: string, maxLength: number) => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 3).trimEnd()}...`;
};

const pickFields = (value: unknown, keys: string[]) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const pickedEntries = keys
    .map((key) => [key, (value as Record<string, unknown>)[key]] as const)
    .filter(([, entryValue]) => {
      if (entryValue === null || entryValue === undefined) {
        return false;
      }

      if (typeof entryValue === "string") {
        return entryValue.trim().length > 0;
      }

      return true;
    })
    .map(([key, entryValue]) => [
      key,
      typeof entryValue === "string" ? truncateText(entryValue, 120) : entryValue,
    ]);

  return pickedEntries.length > 0 ? Object.fromEntries(pickedEntries) : undefined;
};

const compactContext = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const context = value as Record<string, unknown>;
  const profile = pickFields(context.profile, [
    "full_name",
    "industry",
    "state",
    "business_stage",
    "location_data",
    "preferred_language",
    "onboarding_completed",
  ]);
  const businesses = Array.isArray(context.businesses)
    ? context.businesses
        .slice(0, 2)
        .map((business) =>
          pickFields(business, [
            "name",
            "industry",
            "stage",
            "structure",
            "city",
            "state",
            "target_market",
          ])
        )
        .filter(Boolean)
    : [];
  const generalEntries = Object.entries(context)
    .filter(([key]) =>
      ["language", "currentPage", "page", "industry", "state", "business_stage"].includes(key)
    )
    .map(([key, entryValue]) => [
      key,
      typeof entryValue === "string" ? truncateText(entryValue, 120) : entryValue,
    ]);
  const savedToolsCount = Array.isArray(context.saved_tools) ? context.saved_tools.length : undefined;

  return Object.fromEntries(
    [
      ...generalEntries,
      ["profile", profile],
      ["businesses", businesses.length > 0 ? businesses : undefined],
      ["saved_tools_count", savedToolsCount],
    ].filter(([, entryValue]) => entryValue !== undefined)
  );
};

const normalizeMessages = (messages: ChatMessage[]): GeminiMessage[] => {
  const cleanedMessages = messages
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      content: truncateText(message.content, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content.length > 0);

  const firstUserIndex = cleanedMessages.findIndex((message) => message.role === "user");
  const conversation =
    firstUserIndex === -1 ? [] : cleanedMessages.slice(firstUserIndex).slice(-MAX_HISTORY_MESSAGES);

  return conversation.reduce<GeminiMessage[]>((accumulator, message) => {
    const lastMessage = accumulator[accumulator.length - 1];

    if (lastMessage?.role === message.role) {
      lastMessage.parts[0].text = `${lastMessage.parts[0].text}\n\n${message.content}`;
      return accumulator;
    }

    accumulator.push({
      role: message.role,
      parts: [{ text: message.content }],
    });

    return accumulator;
  }, []);
};

const extractGeminiText = (payload: any) =>
  payload?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part?.text ?? "")
    .join("")
    .trim() ?? "";

const createSseResponse = (text: string) => {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      if (text) {
        const openaiChunk = {
          choices: [{ delta: { content: text } }],
        };
        await writer.write(encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
      }

      await writer.write(encoder.encode("data: [DONE]\n\n"));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
  });
};

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
        customPrompt = truncateText(data.value, MAX_SYSTEM_PROMPT_LENGTH);
      }
    } catch {
      // Fall back to the default prompt when admin settings are unavailable.
    }

    const userLang = typeof context?.language === "string" ? context.language : "en";
    const langInstruction =
      userLang !== "en"
        ? `\nIMPORTANT: Respond in the language with code "${userLang}". Always respond in this language unless the user explicitly asks otherwise.`
        : "";

    const compactUserContext = compactContext(context);
    const defaultPrompt = `You are Bee, the friendly AI assistant for BizHive - India's business growth platform. You are an expert on Indian business startup, legal compliance, taxation, funding, and growth.

User Context:
${JSON.stringify(compactUserContext)}

Guidelines:
- Be friendly, concise, and actionable
- Tailor advice to the user's business stage, industry, and location
- Reference Indian regulations, schemes, and market conditions
- If the user is on a specific page, relate your answers to that context
- Use markdown formatting for clarity${langInstruction}`;

    const systemPrompt =
      truncateText(systemOverride, MAX_SYSTEM_PROMPT_LENGTH) || customPrompt || defaultPrompt;
    const allMessages = normalizeMessages(messages);

    if (allMessages.length === 0) {
      return jsonResponse({ error: "A user message is required to start the chat." }, 400);
    }

    const modelName = Deno.env.get("GEMINI_MODEL")?.trim() || "gemini-2.5-flash-lite";
    const requestBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: allMessages,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);

      const fallbackResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (fallbackResponse.ok) {
        const fallbackPayload = await fallbackResponse.json();
        const fallbackText = extractGeminiText(fallbackPayload);

        if (fallbackText) {
          return createSseResponse(fallbackText);
        }
      } else {
        console.error("Gemini fallback error:", fallbackResponse.status, await fallbackResponse.text());
      }

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
              const text = extractGeminiText(parsed);

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
