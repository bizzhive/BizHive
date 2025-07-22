import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Lightbulb, TrendingUp, FileText, Calculator } from "lucide-react";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([
    {
      type: "assistant",
      message: "Hello! I'm your BizHive AI Assistant. I can help you with business planning, market research, financial calculations, and much more. What would you like to know today?"
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setConversation(prev => [...prev, { type: "user", message }]);
    setMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      setConversation(prev => [...prev, {
        type: "assistant",
        message: "I understand you're asking about business topics. While I'm still learning, I can help guide you to the right resources on BizHive. Would you like me to recommend specific tools or sections that might help with your question?"
      }]);
    }, 1000);
  };

  const quickActions = [
    { icon: Lightbulb, title: "Business Ideas", description: "Get help brainstorming business concepts" },
    { icon: TrendingUp, title: "Market Analysis", description: "Analyze market trends and opportunities" },
    { icon: FileText, title: "Business Plans", description: "Create comprehensive business plans" },
    { icon: Calculator, title: "Financial Planning", description: "Calculate costs, revenue, and projections" }
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
                  >
                    <action.icon className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <MessageCircle className="h-5 w-5" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-600 text-white'
                      }`}>
                        {msg.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border dark:border-gray-600'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask me anything about business planning, market research, or strategies..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[50px] resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} className="px-6">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">What I Can Help With</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Business plan creation and review</li>
                  <li>• Market research and analysis</li>
                  <li>• Financial projections and calculations</li>
                  <li>• Legal compliance guidance</li>
                  <li>• Marketing strategies</li>
                  <li>• Operational planning</li>
                  <li>• Risk assessment</li>
                  <li>• Growth strategies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">AI Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                    24/7 Availability
                  </Badge>
                  <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                    Instant Responses
                  </Badge>
                  <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                    Industry Expertise
                  </Badge>
                  <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                    Personalized Advice
                  </Badge>
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