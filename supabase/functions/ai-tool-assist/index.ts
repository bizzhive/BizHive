import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const MAX_ADMIN_PROMPT_LENGTH = 3000;
const MAX_CONTEXT_TEXT_LENGTH = 120;
const MAX_USER_PROMPT_LENGTH = 600;
const MAX_OUTPUT_TOKENS = 256;

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

  const entries = keys
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
      typeof entryValue === "string" ? truncateText(entryValue, MAX_CONTEXT_TEXT_LENGTH) : entryValue,
    ]);

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

const compactContext = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const context = value as Record<string, unknown>;
  const businesses = Array.isArray(context.businesses)
    ? context.businesses
        .slice(0, 2)
        .map((business) =>
          pickFields(business, ["name", "industry", "stage", "city", "state", "target_market"])
        )
        .filter(Boolean)
    : [];

  return Object.fromEntries(
    [
      ["language", typeof context.language === "string" ? truncateText(context.language, 32) : undefined],
      ["currentPage", typeof context.currentPage === "string" ? truncateText(context.currentPage, 64) : undefined],
      [
        "profile",
        pickFields(context.profile, [
          "full_name",
          "industry",
          "state",
          "business_stage",
          "location_data",
          "preferred_language",
        ]),
      ],
      ["businesses", businesses.length > 0 ? businesses : undefined],
    ].filter(([, entryValue]) => entryValue !== undefined)
  );
};

const extractGeminiText = (payload: any) =>
  payload?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part?.text ?? "")
    .join("")
    .trim() ?? "";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context, field } = await req.json();
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");

    if (typeof prompt !== "string" || !prompt.trim()) {
      return jsonResponse({ error: "A prompt is required." }, 400);
    }

    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured");
    }

    let adminPrompt = "";
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
        adminPrompt = truncateText(data.value, MAX_ADMIN_PROMPT_LENGTH);
      }
    } catch {
      // Ignore admin prompt lookup failures for tool assist.
    }

    const safeField = typeof field === "string" && field.trim() ? field.trim() : "business strategy";
    const safeContext = compactContext(context);

    const taskPrompt = `You are an expert business consultant AI helping a founder fill out the "${safeField}" section of a business strategy tool.

User/Business Context:
${JSON.stringify(safeContext)}

Provide a concise, professional, and highly specific suggestion for this section. DO NOT use introductory or concluding filler phrases. Just provide the raw content in a few bullet points or short sentences.`;

    const fullPrompt = adminPrompt
      ? `${adminPrompt}\n\nAdditional task instructions:\n${taskPrompt}\n\nUser prompt: ${truncateText(prompt, MAX_USER_PROMPT_LENGTH)}`
      : `${taskPrompt}\n\nUser prompt: ${truncateText(prompt, MAX_USER_PROMPT_LENGTH)}`;

    const modelName = Deno.env.get("GEMINI_MODEL")?.trim() || "gemini-2.5-flash-lite";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google AI API error: ${await response.text()}`);
    }

    const data = await response.json();
    const suggestion = extractGeminiText(data);

    if (!suggestion) {
      throw new Error("No suggestion was returned by Gemini.");
    }

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-tool-assist function:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});
