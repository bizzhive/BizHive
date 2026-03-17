
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import BeeIcon from "./BeeIcon";

type Msg = { role: "user" | "assistant"; content: string };

const INITIAL_MSG: Msg = {
  role: "assistant",
  content: "Hey! I'm **Bee** 🐝, your BizHive assistant. Ask me anything about business planning, legal compliance, funding, or whatever you see on this page!"
};

interface BeePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillMessage?: string;
  inline?: boolean;
}

const BeePanel = ({ open, onOpenChange, prefillMessage, inline }: BeePanelProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MSG]);
  const [userContext, setUserContext] = useState<any>(null);
  const { session, user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (prefillMessage && open) {
      setMessage(prefillMessage);
    }
  }, [prefillMessage, open]);

  useEffect(() => {
    const fetchContext = async () => {
      if (!user) return;
      const [{ data: profile }, { data: businesses }, { data: tools }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("businesses").select("*").eq("user_id", user.id),
        supabase.from("saved_tools").select("tool_type, title, data").eq("user_id", user.id),
      ]);
      setUserContext({ profile, businesses, saved_tools: tools });
    };
    fetchContext();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = useCallback(async (chatMessages: Msg[]) => {
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
          messages: chatMessages.filter((m) => m !== INITIAL_MSG),
          context: { ...userContext, currentPage: location.pathname },
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) throw new Error("Rate limit exceeded. Try again later.");
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
          if (last?.role === "assistant") return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: full } : m));
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
          } catch {}
        }
      }
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [session, userContext, location.pathname, toast]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: message.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setMessage("");
    setIsLoading(true);
    await streamChat(newMsgs);
  };

  if (!open) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BeeIcon className="w-6 h-6" />
          <span className="font-semibold text-sm">Bee Assistant</span>
          <span className="text-xs text-muted-foreground">{location.pathname}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
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
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <BeeIcon className="w-4 h-4" />
              </div>
              <div className="flex gap-1 px-3 py-2 bg-muted rounded-xl">
                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask Bee anything..."
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
