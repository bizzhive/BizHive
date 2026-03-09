import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AIAssistButtonProps {
  field: string;
  onSuggestion: (suggestion: string) => void;
  context?: any;
}

export function AIAssistButton({ field, onSuggestion, context }: AIAssistButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const handleAssist = async () => {
    if (!user) {
      toast.error("Please log in to use AI features.");
      return;
    }

    setIsGenerating(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const fullContext = {
        profile,
        business,
        ...context
      };

      const { data, error } = await supabase.functions.invoke('ai-tool-assist', {
        body: {
          prompt: `Please suggest relevant content for the "${field}" section based on my business context.`,
          context: fullContext,
          field
        }
      });

      if (error) throw error;
      
      if (data.suggestion) {
        onSuggestion(data.suggestion);
        toast.success("AI suggestion generated!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate AI suggestion.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleAssist} 
      disabled={isGenerating}
      className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 h-8 px-2 py-1"
    >
      {isGenerating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
      <span className="text-xs">AI Assist</span>
    </Button>
  );
}
