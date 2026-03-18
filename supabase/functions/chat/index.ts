import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not configured');
    }

    // Try to load custom system prompt from admin_settings
    let customPrompt = "";
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const sb = createClient(supabaseUrl, supabaseKey);
      const { data } = await sb.from('admin_settings').select('value').eq('key', 'ai_system_prompt').single();
      if (data?.value) customPrompt = data.value;
    } catch {}

    const defaultPrompt = `You are Bee, the friendly AI assistant for BizHive — India's business growth platform. You are an expert on Indian business startup, legal compliance, taxation, funding, and growth.

User Context:
${JSON.stringify(context, null, 2)}

Guidelines:
- Be friendly, concise, and actionable
- Tailor advice to the user's business stage, industry, and location
- Reference Indian regulations, schemes, and market conditions
- If the user is on a specific page, relate your answers to that context
- Use markdown formatting for clarity
- You can use emojis to make responses engaging`;

    const systemPrompt = customPrompt || defaultPrompt;

    // Build contents for Gemini API
    const contents = [];
    
    // Add system instruction as first user message context
    const allMessages = [
      { role: 'user', parts: [{ text: `System instructions: ${systemPrompt}` }] },
      { role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] },
    ];

    for (const msg of messages) {
      allMessages.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse&key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: allMessages }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI API error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform Gemini SSE stream to OpenAI-compatible SSE format
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
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);

            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6);

            try {
              const parsed = JSON.parse(jsonStr);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                // Convert to OpenAI-compatible format
                const openaiChunk = {
                  choices: [{ delta: { content: text } }],
                };
                await writer.write(encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
              }
            } catch {}
          }
        }

        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } catch (e) {
        console.error("Stream error:", e);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
