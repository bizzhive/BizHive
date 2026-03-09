import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Lightbulb, TrendingUp, FileText, Calculator } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hello! I'm your BizHive AI Assistant. I can help you with business planning, market research, financial calculations, and much more. What would you like to know today?"
    }
  ]);
  const [userContext, setUserContext] = useState<any>(null);
  const { session, user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContext = async () => {
      if (!user) return;
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      const { data: businesses } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id);
        
      const { data: tools } = await supabase
        .from("saved_tools")
        .select("tool_type, title, data")
        .eq("user_id", user.id);

      setUserContext({
        profile,
        businesses,
        saved_tools: tools
      });
    };

    fetchContext();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = async (chatMessages: Msg[]) => {
    if (!session?.access_token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the AI Assistant.",
        variant: "destructive",
      });
      return;
    }

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          messages: chatMessages.filter(m => m.role !== 'assistant' || m.content !== "Hello! I'm your BizHive AI Assistant. I can help you with business planning, market research, financial calculations, and much more. What would you like to know today?"), 
          context: userContext 
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          throw new Error("Rate limits exceeded, please try again later.");
        }
        if (resp.status === 402) {
          throw new Error("Payment required. AI service needs credits.");
        }
        throw new Error("Failed to connect to AI Assistant.");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantSoFar = "";

      const upsertAssistant = (nextChunk: string) => {
        assistantSoFar += nextChunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { }
        }
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the AI Assistant.",
        variant: "destructive",
      });
      return;
    }
    
    const userMsg: Msg = { role: "user", content: message.trim() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);
    
    await streamChat(newMessages);
  };

  const quickActions = [
    { icon: Lightbulb, title: "Business Ideas", prompt: "I'm looking for business ideas. Based on my profile context, what industries or concepts would you suggest?" },
    { icon: TrendingUp, title: "Market Analysis", prompt: "Can you provide a brief market analysis based on the industry mentioned in my profile?" },
    { icon: FileText, title: "Business Plans", prompt: "What are the essential sections I need for my business plan right now?" },
    { icon: Calculator, title: "Financial Planning", prompt: "What financial metrics should I be tracking at my current business stage?" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 animate-bounce-in">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            AI Business Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up">
            Get instant help with business planning, market research, financial calculations, and strategic decisions
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8">
          {/* Quick Actions */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Quick Actions</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Get started with these common business tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 justify-start dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                    onClick={() => {
                      setMessage(action.prompt);
                    }}
                  >
                    <action.icon className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="dark:bg-gray-800 dark:border-gray-700 flex flex-col h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <MessageCircle className="h-5 w-5" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-600 text-white'
                      }`}>
                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`p-4 rounded-xl ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border dark:border-gray-600'
                      }`}>
                        {msg.role === 'user' ? (
                          <p className="text-sm">{msg.content}</p>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask me anything about business planning, market research, or strategies..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  className="min-h-[50px] max-h-[150px] resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!message.trim() || isLoading}
                  className="px-6 h-auto"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
