import {
  createSupabaseFunctionHeaders,
  getSupabaseFunctionUrl,
} from '@/services/supabase/client';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const prepareChatMessages = (messages: ChatMessage[]) => {
  const cleanedMessages = messages
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content.trim(),
    }))
    .filter((message) => message.content.length > 0);

  const firstUserIndex = cleanedMessages.findIndex((message) => message.role === 'user');
  const conversation =
    firstUserIndex === -1 ? [] : cleanedMessages.slice(firstUserIndex);

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
  accessToken: string;
  messages: ChatMessage[];
  context?: Record<string, unknown> | null;
  systemOverride?: string;
  onChunk?: (chunk: string, fullResponse: string) => void;
  timeoutMs?: number;
  errorMessages?: {
    rateLimit?: string;
    credits?: string;
    timeout?: string;
    empty?: string;
    default?: string;
  };
};

const readFunctionError = async (response: Response) => {
  try {
    const payload = await response.json();
    return typeof payload?.error === 'string' ? payload.error : null;
  } catch {
    return null;
  }
};

export const streamBizHiveChat = async ({
  accessToken,
  messages,
  context,
  systemOverride,
  onChunk,
  timeoutMs = 45000,
  errorMessages,
}: StreamBizHiveChatOptions) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const preparedMessages = prepareChatMessages(messages);

  try {
    if (preparedMessages.length === 0) {
      throw new Error(errorMessages?.default ?? 'Failed to connect to Bee.');
    }

    const response = await fetch(getSupabaseFunctionUrl('chat'), {
      method: 'POST',
      headers: createSupabaseFunctionHeaders(accessToken),
      body: JSON.stringify({
        messages: preparedMessages,
        context,
        ...(systemOverride ? { systemOverride } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const fallbackMessage =
        (await readFunctionError(response)) ??
        errorMessages?.default ??
        'Failed to connect to Bee.';

      if (response.status === 429) {
        throw new Error(errorMessages?.rateLimit ?? fallbackMessage);
      }

      if (response.status === 402) {
        throw new Error(errorMessages?.credits ?? fallbackMessage);
      }

      throw new Error(fallbackMessage);
    }

    if (!response.body) {
      throw new Error(errorMessages?.default ?? 'No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) {
          line = line.slice(0, -1);
        }

        if (!line.startsWith('data: ')) {
          continue;
        }

        const payload = line.slice(6).trim();
        if (payload === '[DONE]') {
          if (!fullResponse.trim()) {
            throw new Error(errorMessages?.empty ?? errorMessages?.default ?? 'Bee could not generate a response.');
          }

          return fullResponse;
        }

        try {
          const chunk = JSON.parse(payload).choices?.[0]?.delta?.content;
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
      throw new Error(errorMessages?.empty ?? errorMessages?.default ?? 'Bee could not generate a response.');
    }

    return fullResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(errorMessages?.timeout ?? 'Bee is taking longer than expected. Please try again.');
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};
