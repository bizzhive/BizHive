import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  BeeProviderError,
  corsHeaders,
  createServiceRoleClient,
  jsonResponse,
  runBeePrompt,
  type BeeContextInput,
} from "../_shared/bee-runtime.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context, field } = await req.json();

    if (typeof prompt !== "string" || !prompt.trim()) {
      return jsonResponse({ error: "A prompt is required." }, 400);
    }

    const safeField =
      typeof field === "string" && field.trim() ? field.trim() : "business strategy";
    const safeContext =
      context && typeof context === "object" && !Array.isArray(context)
        ? (context as BeeContextInput)
        : {};
    const supabase = createServiceRoleClient();

    const result = await runBeePrompt(
      {
        allowAutoFallback: true,
        context: safeContext,
        maxOutputTokens: 320,
        messages: [
          {
            role: "user",
            content: `Help me improve the "${safeField}" section. Here is the founder prompt: ${prompt.trim()}`,
          },
        ],
        mode: "tool",
        session: {},
        toolField: safeField,
      },
      supabase
    );

    return jsonResponse({
      slotIndex: result.slotIndex,
      suggestion: result.text,
    });
  } catch (error) {
    console.error("Error in ai-tool-assist function:", error);
    return jsonResponse(
      {
        error:
          error instanceof BeeProviderError
            ? "Bee could not prepare a tool suggestion right now."
            : error instanceof Error
              ? error.message
              : "Unknown error",
      },
      error instanceof BeeProviderError && error.statusCode === 429 ? 429 : 500
    );
  }
});
