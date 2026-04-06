import {
  createSupabaseFunctionHeaders,
  getSupabaseFunctionUrl,
} from "@/services/supabase/client";

export type ChatMessage = {
  content: string;
  role: "user" | "assistant";
};

export class BeeChatError extends Error {
  retryable: boolean;
  status?: number;

  constructor(message: string, options?: { retryable?: boolean; status?: number }) {
    super(message);
    this.name = "BeeChatError";
    this.retryable = options?.retryable ?? false;
    this.status = options?.status;
  }
}

const prepareChatMessages = (messages: ChatMessage[]) => {
  const cleanedMessages = messages
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content.trim(),
    }))
    .filter((message) => message.content.length > 0);

  const firstUserIndex = cleanedMessages.findIndex((message) => message.role === "user");
  const conversation = firstUserIndex === -1 ? [] : cleanedMessages.slice(firstUserIndex);

  return conversation.reduce<ChatMessage[]>((accumulator, message) => {
    const lastMessage = accumulator[accumulator.length - 1];

    if (lastMessage?.role === message.role) {
      lastMessage.content = `${lastMessage.content}\n\n${message.content}`;
      return accumulator;
    }

    accumulator.push({ ...message });
    return accumulator;
  }, []);
};

type StreamBizHiveChatOptions = {
  accessToken?: string | null;
  context?: Record<string, unknown> | null;
  errorMessages?: {
    credits?: string;
    default?: string;
    empty?: string;
    rateLimit?: string;
    timeout?: string;
  };
  messages: ChatMessage[];
  onChunk?: (chunk: string, fullResponse: string) => void;
  retry?: boolean;
  sessionId: string;
  slotIndexHint?: number;
  systemOverride?: string;
  timeoutMs?: number;
};

export type StreamBizHiveChatResult = {
  sessionId: string;
  slotIndex?: number;
  text: string;
};

const parseSlotIndex = (value: string | null) => {
  if (value === null) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const readFunctionError = async (response: Response) => {
  try {
    const payload = (await response.json()) as {
      error?: string;
      retryable?: boolean;
    };

    return {
      message: typeof payload?.error === "string" ? payload.error : null,
      retryable: Boolean(payload?.retryable),
    };
  } catch {
    return {
      message: null,
      retryable: false,
    };
  }
};

export const streamBizHiveChat = async ({
  accessToken,
  messages,
  context,
  systemOverride,
  sessionId,
  retry = false,
  slotIndexHint,
  onChunk,
  timeoutMs = 45000,
  errorMessages,
}: StreamBizHiveChatOptions): Promise<StreamBizHiveChatResult> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const preparedMessages = prepareChatMessages(messages);

  try {
    if (preparedMessages.length === 0) {
      throw new BeeChatError(errorMessages?.default ?? "Failed to connect to Bee.");
    }

    const response = await fetch(getSupabaseFunctionUrl("chat"), {
      method: "POST",
      headers: createSupabaseFunctionHeaders(accessToken ?? undefined),
      body: JSON.stringify({
        messages: preparedMessages,
        context,
        retry,
        sessionId,
        slotIndexHint,
        ...(systemOverride ? { systemOverride } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const payload = await readFunctionError(response);
      const fallbackMessage = payload.message ?? errorMessages?.default ?? "Failed to connect to Bee.";
      const resolvedMessage =
        response.status === 429
          ? errorMessages?.rateLimit ?? fallbackMessage
          : response.status === 402
            ? errorMessages?.credits ?? fallbackMessage
            : fallbackMessage;

      throw new BeeChatError(resolvedMessage, {
        retryable: payload.retryable,
        status: response.status,
      });
    }

    if (!response.body) {
      throw new BeeChatError(errorMessages?.default ?? "No response body");
    }

    let responseSessionId = response.headers.get("x-bee-session-id") ?? sessionId;
    let responseSlotIndex = parseSlotIndex(response.headers.get("x-bee-slot-index"));
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) {
          line = line.slice(0, -1);
        }

        if (!line.startsWith("data: ")) {
          continue;
        }

        const payload = line.slice(6).trim();
        if (payload === "[DONE]") {
          if (!fullResponse.trim()) {
            throw new BeeChatError(
              errorMessages?.empty ?? errorMessages?.default ?? "Bee could not generate a response."
            );
          }

          return {
            sessionId: responseSessionId,
            slotIndex: responseSlotIndex,
            text: fullResponse,
          };
        }

        try {
          const parsed = JSON.parse(payload) as {
            bee?: { sessionId?: string; slotIndex?: number };
            choices?: Array<{ delta?: { content?: string } }>;
          };
          if (parsed.bee?.sessionId) {
            responseSessionId = parsed.bee.sessionId;
          }
          if (typeof parsed.bee?.slotIndex === "number" && Number.isFinite(parsed.bee.slotIndex)) {
            responseSlotIndex = parsed.bee.slotIndex;
          }

          const chunk = parsed.choices?.[0]?.delta?.content;
          if (!chunk) {
            continue;
          }

          fullResponse += chunk;
          onChunk?.(chunk, fullResponse);
        } catch {
          // Ignore malformed SSE chunks while the stream is still in flight.
        }
      }
    }

    if (!fullResponse.trim()) {
      throw new BeeChatError(
        errorMessages?.empty ?? errorMessages?.default ?? "Bee could not generate a response."
      );
    }

    return {
      sessionId: responseSessionId,
      slotIndex: responseSlotIndex,
      text: fullResponse,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new BeeChatError(
        errorMessages?.timeout ?? "Bee is taking longer than expected. Please try again.",
        { retryable: true }
      );
    }

    if (error instanceof BeeChatError) {
      throw error;
    }

    throw new BeeChatError(
      error instanceof Error ? error.message : errorMessages?.default ?? "Failed to connect to Bee.",
      { retryable: true }
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
};
