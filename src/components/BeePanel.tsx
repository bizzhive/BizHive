import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
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

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: t("ai.welcome", "Hey! I'm **Bee**, your BizHive assistant. Ask me anything about business planning, legal compliance, funding, or whatever you see on this page!")
      }]);
    }
  }, [messages.length, t]);

  useEffect(() => {
    if (prefillMessage && open) {
      setMessage(prefillMessage);
    }
  }, [prefillMessage, open]);

  useEffect(() => {
    const fetchContext = async () => {
      if (!user) return;
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
              return prev.map((message, index) =>
                index === prev.length - 1 ? { ...message, content: fullResponse } : message
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
    } catch (e) {
      const description = e instanceof Error ? e.message : t("Unknown error");
      appendAssistantMessage(t("ai.unavailableDescription"));
      toast({ title: t("ai.unavailable"), description, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    if (!session?.access_token) {
      toast({ title: t("Login Required"), description: t("Please log in to chat with Bee."), variant: "destructive" });
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: message.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setMessage("");
    setIsLoading(true);
    await streamChat(newMsgs);
  };

  if (!open) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BeeIcon className="w-6 h-6" />
          <span className="font-semibold text-sm">{t("Bee Assistant")}</span>
          <span className="text-xs text-muted-foreground">{location.pathname}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-start gap-2 max-w-[90%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/10"}`}>
                {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <BeeIcon className="w-4 h-4" />}
              </div>
              <div className={`px-3 py-2 rounded-xl text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {msg.role === "user" ? (
                  <p>{msg.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1 [&>ul]:mb-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <BeeIcon className="w-4 h-4" />
              </div>
              <div className="space-y-2 px-3 py-2 bg-muted rounded-xl">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
                {isSlowResponse && (
                  <p className="max-w-52 text-xs text-muted-foreground">{t("ai.responseDelayedDescription")}</p>
                )}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            placeholder={t("Ask Bee anything...")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            className="min-h-[40px] max-h-[100px] resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={!message.trim() || isLoading} size="icon" className="shrink-0 h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeePanel;
