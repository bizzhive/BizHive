import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Clock3, Send, Sparkles, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserAiContext } from "@/services/ai/context";
import { type ChatMessage, streamBizHiveChat } from "@/services/ai/chat";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BeeIcon from "./BeeIcon";

interface BeePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillMessage?: string;
}

const starterPrompts = [
  "Help me understand the page I am on",
  "What should I do next for my business?",
  "Summarize the important steps for me",
];

const BeePanel = ({ open, onOpenChange, prefillMessage }: BeePanelProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSlowResponse, setIsSlowResponse] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userContext, setUserContext] = useState<Record<string, unknown> | null>(null);
  const { session, user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { i18n, t } = useTranslation();

  const welcomeMessage = useMemo(
    () =>
      t(
        "ai.welcome",
        "Hey! I'm **Bee**. I can explain confusing terms, guide your next step, and help you move through BizHive faster."
      ),
    [t]
  );

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: welcomeMessage }]);
    }
  }, [messages.length, welcomeMessage]);

  useEffect(() => {
    if (prefillMessage && open) {
      setMessage(prefillMessage);
    }
  }, [prefillMessage, open]);

  useEffect(() => {
    const fetchContext = async () => {
      if (!user) {
        return;
      }

      setUserContext(await fetchUserAiContext(user.id));
    };

    void fetchContext();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      setIsSlowResponse(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setIsSlowResponse(true), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [isLoading]);

  const appendAssistantMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
  };

  const streamChat = async (chatMessages: ChatMessage[]) => {
    try {
      await streamBizHiveChat({
        accessToken: session!.access_token,
        messages: chatMessages,
        context: { ...userContext, currentPage: location.pathname, language: i18n.language },
        onChunk: (_chunk, fullResponse) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((entry, index) =>
                index === prev.length - 1 ? { ...entry, content: fullResponse } : entry
              );
            }

            return [...prev, { role: "assistant", content: fullResponse }];
          });
        },
        errorMessages: {
          rateLimit: t("Rate limit exceeded. Try again later."),
          credits: t("AI credits needed."),
          timeout: t("ai.responseDelayed"),
          empty: t("ai.emptyResponse"),
          default: t("Failed to connect to Bee."),
        },
      });
    } catch (error) {
      const description = error instanceof Error ? error.message : t("Unknown error");
      appendAssistantMessage(t("ai.unavailableDescription"));
      toast({ title: t("ai.unavailable"), description, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (nextMessage = message) => {
    if (!nextMessage.trim() || isLoading) {
      return;
    }

    if (!session?.access_token) {
      toast({
        title: t("Login Required"),
        description: t("Please log in to chat with Bee."),
        variant: "destructive",
      });
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: nextMessage.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);
    await streamChat(newMessages);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,_rgba(255,247,240,0.94),_rgba(255,255,255,0.98))] dark:bg-[linear-gradient(180deg,_rgba(38,23,16,0.96),_rgba(23,15,11,0.98))]">
      <div className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,145,77,0.18),_transparent_48%)] px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/14 text-primary shadow-[inset_0_0_0_1px_rgba(255,145,77,0.18)]">
              <BeeIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                  {t("Bee Assistant")}
                </h2>
                <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  {t("Available")}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {t("Focused on this page")}: <span className="font-medium text-foreground">{location.pathname}</span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.length <= 1 ? (
          <div className="rounded-[24px] border border-border/70 bg-background/65 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("Try one of these")}
            </div>
            <div className="flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setMessage(prompt)}
                  className="rounded-full border border-border/70 bg-muted/45 px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-accent"
                >
                  {t(prompt)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((entry, index) => (
          <div
            key={`${entry.role}-${index}`}
            className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[92%] items-start gap-3 ${entry.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                  entry.role === "user" ? "bg-foreground text-background" : "bg-primary/12 text-primary"
                }`}
              >
                {entry.role === "user" ? <User className="h-4 w-4" /> : <BeeIcon className="h-5 w-5" />}
              </div>
              <div
                className={`rounded-[22px] px-4 py-3 text-sm leading-7 shadow-sm ${
                  entry.role === "user"
                    ? "bg-foreground text-background"
                    : "border border-border/70 bg-background/82 text-foreground"
                }`}
              >
                {entry.role === "user" ? (
                  <p>{entry.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:mb-2 [&>ul]:mb-2">
                    <ReactMarkdown>{entry.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" ? (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <BeeIcon className="h-5 w-5" />
              </div>
              <div className="rounded-[22px] border border-border/70 bg-background/78 px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45 animate-bounce" />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45 animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45 animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
                {isSlowResponse ? (
                  <div className="mt-3 flex max-w-52 items-start gap-2 text-xs leading-5 text-muted-foreground">
                    <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{t("ai.responseDelayedDescription")}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border/70 bg-background/72 px-4 py-4 backdrop-blur sm:px-5">
        <div className="flex gap-3">
          <Textarea
            placeholder={t("Ask Bee anything...")}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={isLoading}
            className="min-h-[56px] max-h-[120px] resize-none rounded-[22px] border-border/70 bg-muted/35 px-4 py-3 text-sm leading-6"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSend();
              }
            }}
          />
          <Button
            onClick={() => void handleSend()}
            disabled={!message.trim() || isLoading}
            size="icon"
            className="h-14 w-14 shrink-0 rounded-[22px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeePanel;
