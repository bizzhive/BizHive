
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Lightbulb, TrendingUp, FileText, Calculator, History, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BeeIcon from "@/components/BeeIcon";
import { useTranslation } from "react-i18next";

type Msg = { role: "user" | "assistant"; content: string };
type ChatSessionSummary = { id: string; firstMsg: string; date: string };
type UserContext = {
  profile: unknown;
  businesses: unknown[] | null;
  saved_tools: unknown[] | null;
} | null;

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [userContext, setUserContext] = useState<UserContext>(null);
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
      const [{ data: profile }, { data: businesses }, { data: tools }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("businesses").select("*").eq("user_id", user.id),
        supabase.from("saved_tools").select("tool_type, title, data").eq("user_id", user.id),
      ]);
      setUserContext({ profile, businesses, saved_tools: tools });
    };
    fetchContext();
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

  const streamChat = async (chatMessages: Msg[]) => {
    if (!session?.access_token) {
      toast({ title: "Login Required", description: "Please log in to chat with Bee.", variant: "destructive" });
      return;
    }

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: chatMessages,
          context: { ...userContext, currentPage: "/ai-assistant", language: i18n.language },
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) throw new Error("Rate limit exceeded.");
        if (resp.status === 402) throw new Error("AI credits needed.");
        throw new Error("Failed to connect to Bee.");
      }

      if (!resp.body) throw new Error("No response body");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let full = "";

      const upsert = (chunk: string) => {
        full += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.content !== t("ai.welcome")) return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: full } : m));
          return [...prev, { role: "assistant", content: full }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const c = JSON.parse(json).choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            // Ignore malformed chunks while the response stream is still in flight.
          }
        }
      }

      // Save messages to DB
      if (user && full) {
        const sessionId = currentSessionId || crypto.randomUUID();
        if (!currentSessionId) setCurrentSessionId(sessionId);
        const userMsg = chatMessages[chatMessages.length - 1];
        await supabase.from("chat_messages").insert([
          { user_id: user.id, session_id: sessionId, role: "user", content: userMsg.content },
          { user_id: user.id, session_id: sessionId, role: "assistant", content: full },
        ]);
      }
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: message.trim() };
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Bee AI Assistant</h1>
          <p className="text-muted-foreground">Your personal business advisor powered by AI</p>
        </div>

        <div className="max-w-6xl mx-auto flex gap-6">
          {/* Sidebar - Chat History */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <History className="h-4 w-4" /> Chat History
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={newChat}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 max-h-[400px] overflow-y-auto">
                {chatSessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No previous chats</p>
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
                    onClick={() => setMessage(action.prompt)}
                  >
                    <action.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs">{action.title}</span>
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
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <BeeIcon className="w-5 h-5" />
                        </div>
                        <div className="flex gap-1 px-4 py-3 bg-muted rounded-2xl">
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="px-4 py-3 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask Bee anything about your business..."
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
                  {!user && <p className="text-xs text-muted-foreground mt-2 text-center">Please log in to use the AI assistant.</p>}
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
