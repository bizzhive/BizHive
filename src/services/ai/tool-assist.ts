import {
  createSupabaseFunctionHeaders,
  getSupabaseFunctionUrl,
} from "@/services/supabase/client";

export const requestToolSuggestion = async (input: {
  accessToken?: string | null;
  context?: Record<string, unknown>;
  field: string;
  prompt: string;
}) => {
  const response = await fetch(getSupabaseFunctionUrl("ai-tool-assist"), {
    method: "POST",
    headers: createSupabaseFunctionHeaders(input.accessToken ?? undefined),
    body: JSON.stringify({
      context: input.context ?? {},
      field: input.field,
      prompt: input.prompt,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
    slotIndex?: number;
    suggestion?: string;
  };

  if (!response.ok || typeof payload?.suggestion !== "string") {
    throw new Error(payload?.error || "Bee could not prepare a suggestion right now.");
  }

  return {
    slotIndex:
      typeof payload.slotIndex === "number" && Number.isFinite(payload.slotIndex)
        ? payload.slotIndex
        : undefined,
    suggestion: payload.suggestion,
  };
};
