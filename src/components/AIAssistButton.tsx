import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/services/supabase/client";
import { fetchUserAiContext } from "@/services/ai/context";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface AIAssistButtonProps {
  field: string;
  onSuggestion: (suggestion: string) => void;
  context?: Record<string, unknown>;
}

export function AIAssistButton({ field, onSuggestion, context }: AIAssistButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleAssist = async () => {
    if (!user) {
      toast.error(t("Please log in to use the AI assistant."));
      return;
    }

    setIsGenerating(true);
    try {
      const fullContext = {
        ...(await fetchUserAiContext(user.id)),
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

      if (typeof data?.suggestion !== "string" || !data.suggestion.trim()) {
        throw new Error(t("ai.suggestionUnavailable"));
      }

      onSuggestion(data.suggestion);
      toast.success(t("ai.suggestionReady"));
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : t("ai.suggestionFailed"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleAssist} 
      disabled={isGenerating}
      className="h-8 rounded-full border-primary/20 bg-primary/8 px-3 text-primary hover:bg-primary/12 hover:text-primary"
    >
      {isGenerating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
      <span className="text-xs">{t("ai.assist")}</span>
    </Button>
  );
}
