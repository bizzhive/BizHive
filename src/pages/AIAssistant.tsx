
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Lightbulb, TrendingUp, FileText, Calculator, History, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserAiContext } from "@/services/ai/context";
import { type ChatMessage, streamBizHiveChat } from "@/services/ai/chat";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BeeIcon from "@/components/BeeIcon";
import { useTranslation } from "react-i18next";

type ChatSessionSummary = { id: string; firstMsg: string; date: string };

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSlowResponse, setIsSlowResponse] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userContext, setUserContext] = useState<Record<string, unknown> | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSessionSummary[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { session, user } = useAuth();
  const { toast } = useToast();
  const { i18n, t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial message on mount (localized)
    if (messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: t("ai.welcome", "Hey! I'm **Bee**, your BizHive assistant. Ask me anything about business planning, legal compliance, funding, or strategies!")
      }]);
    }
  }, [messages.length, t]);

  useEffect(() => {
    if (!user) return;
    const fetchContext = async () => {
      setUserContext(await fetchUserAiContext(user.id));
    };
    void fetchContext();
  }, [user]);

  // Load chat history
  useEffect(() => {
    if (!user) return;
    const loadSessions = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("session_id, content, created_at, role")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (data) {
        const sessionMap = new Map<string, { id: string; firstMsg: string; date: string }>();
        data.forEach((m) => {
          if (!sessionMap.has(m.session_id) && m.role === "user") {
            sessionMap.set(m.session_id, {
              id: m.session_id,
              firstMsg: m.content.slice(0, 60) + (m.content.length > 60 ? "..." : ""),
              date: m.created_at,
            });
          }
        });
        setChatSessions(Array.from(sessionMap.values()).slice(0, 20));
      }
    };
    loadSessions();
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

  const loadSession = async (sessionId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    
    if (data && data.length > 0) {
      setMessages([...data.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))]);
      setCurrentSessionId(sessionId);
    }
  };

  const newChat = () => {
    setMessages([{ role: "assistant", content: t("ai.welcome") }]);
    setCurrentSessionId(null);
  };

  const streamChat = async (chatMessages: ChatMessage[]) => {
    try {
      const fullResponse = await streamBizHiveChat({
        accessToken: session!.access_token,
        messages: chatMessages,
        context: { ...userContext, currentPage: "/ai-assistant", language: i18n.language },
        onChunk: (_chunk, nextContent) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((message, index) =>
                index === prev.length - 1 ? { ...message, content: nextContent } : message
              );
            }

            return [...prev, { role: "assistant", content: nextContent }];
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

      // Save messages to DB
      if (user && fullResponse) {
        const sessionId = currentSessionId || crypto.randomUUID();
        if (!currentSessionId) setCurrentSessionId(sessionId);
        const userMsg = chatMessages[chatMessages.length - 1];
        await supabase.from("chat_messages").insert([
          { user_id: user.id, session_id: sessionId, role: "user", content: userMsg.content },
          { user_id: user.id, session_id: sessionId, role: "assistant", content: fullResponse },
        ]);
      }
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

  const quickActions = [
    { icon: Lightbulb, title: "Business Ideas", prompt: "Suggest business ideas based on current market trends in India" },
    { icon: TrendingUp, title: "Market Analysis", prompt: "How do I conduct market research for a startup?" },
    { icon: FileText, title: "Business Plan", prompt: "What are the essential sections of a business plan?" },
    { icon: Calculator, title: "Financial Planning", prompt: "What financial metrics should I track for my startup?" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4">
            <BeeIcon className="w-9 h-9" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{t("Bee AI Assistant")}</h1>
          <p className="text-muted-foreground">{t("Your personal business advisor powered by AI")}</p>
        </div>

        <div className="max-w-6xl mx-auto flex gap-6">
          {/* Sidebar - Chat History */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <History className="h-4 w-4" /> {t("Chat History")}
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={newChat}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 max-h-[400px] overflow-y-auto">
                {chatSessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">{t("No previous chats")}</p>
                ) : (
                  chatSessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => loadSession(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-accent transition-colors ${currentSessionId === s.id ? "bg-accent" : ""}`}
                    >
                      <p className="font-medium truncate">{s.firstMsg}</p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">{new Date(s.date).toLocaleDateString()}</p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat */}
          <div className="flex-1 space-y-6">
            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setMessage(t(action.prompt))}
                  >
                    <action.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs">{t(action.title)}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* Chat */}
            <Card className="flex flex-col" style={{ height: messages.length <= 1 ? "500px" : "600px" }}>
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/10"}`}>
                          {msg.role === "user" ? <User className="h-4 w-4" /> : <BeeIcon className="w-5 h-5" />}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          {msg.role === "user" ? (
                            <p>{msg.content}</p>
                          ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
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
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <BeeIcon className="w-5 h-5" />
                        </div>
                        <div className="space-y-2 px-4 py-3 bg-muted rounded-2xl">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                          </div>
                          {isSlowResponse && (
                            <p className="text-xs text-muted-foreground">{t("ai.responseDelayedDescription")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="px-4 py-3 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder={t("Ask Bee anything about your business...")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isLoading}
                      className="min-h-[44px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button onClick={handleSend} disabled={!message.trim() || isLoading} size="icon" className="shrink-0 h-11 w-11">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {!user && <p className="text-xs text-muted-foreground mt-2 text-center">{t("Please log in to use the AI assistant.")}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
