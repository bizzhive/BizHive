import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  BeeProviderError,
  corsHeaders,
  createServiceRoleClient,
  createSseResponse,
  getRequestUser,
  jsonResponse,
  persistChatSuccess,
  runBeePrompt,
  sanitizeMessages,
  type BeeChatMessage,
  type BeeContextInput,
} from "../_shared/bee-runtime.ts";

const GENERIC_RETRY_ERROR =
  "Bee hit a temporary issue while preparing that answer. Retry in a moment.";

const shouldAllowRetry = (error: unknown) => {
  if (!(error instanceof Error)) {
    return true;
  }

  return !/not configured|at least one user message|needs a user message|no more enabled provider slots/i.test(
    error.message
  );
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const rawMessages = Array.isArray(payload?.messages) ? payload.messages : [];
    const messages: BeeChatMessage[] = rawMessages
      .filter(
        (message): message is BeeChatMessage =>
          typeof message?.role === "string" && typeof message?.content === "string"
      )
      .map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content.trim(),
      }))
      .filter((message) => message.content.length > 0);

    const sanitizedMessages = sanitizeMessages(messages);
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1];

    if (!sanitizedMessages.length || lastMessage?.role !== "user") {
      return jsonResponse(
        { error: "A user message is required to continue Bee chat.", retryable: false },
        400
      );
    }

    const context =
      payload?.context && typeof payload.context === "object" && !Array.isArray(payload.context)
        ? (payload.context as BeeContextInput)
        : {};
    const sessionId =
      typeof payload?.sessionId === "string" && payload.sessionId.trim()
        ? payload.sessionId.trim()
        : crypto.randomUUID();
    const retry = Boolean(payload?.retry);
    const slotIndexHint =
      typeof payload?.slotIndexHint === "number" && Number.isFinite(payload.slotIndexHint)
        ? payload.slotIndexHint
        : undefined;
    const systemOverride =
      typeof payload?.systemOverride === "string" ? payload.systemOverride : "";

    const user = await getRequestUser(req);
    const supabase = createServiceRoleClient();
    const result = await runBeePrompt(
      {
        context,
        messages: sanitizedMessages,
        mode: "chat",
        retry,
        session: {
          sessionId,
          slotIndex: slotIndexHint,
          userId: user?.id,
        },
        systemOverride,
      },
      supabase
    );

    await persistChatSuccess(supabase, {
      assistantText: result.text,
      context,
      messages: sanitizedMessages,
      sessionId,
      slot: result.slot,
      slotIndex: result.slotIndex,
      userId: user?.id,
    });

    return createSseResponse(
      result.text,
      {
        "x-bee-session-id": sessionId,
        "x-bee-slot-index": String(result.slotIndex),
      },
      {
        sessionId,
        slotIndex: result.slotIndex,
      }
    );
  } catch (error) {
    console.error("Error in chat function:", error);

    const retryable = shouldAllowRetry(error);
    const status =
      error instanceof BeeProviderError && error.statusCode === 429 ? 429 : retryable ? 503 : 500;

    return jsonResponse(
      {
        error: retryable
          ? GENERIC_RETRY_ERROR
          : error instanceof Error
            ? error.message
            : "Unknown error",
        retryable,
      },
      status
    );
  }
});
