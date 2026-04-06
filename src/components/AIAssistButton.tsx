import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useBee } from "@/contexts/BeeContext";

interface AIAssistButtonProps {
  field: string;
  onSuggestion: (suggestion: string) => void;
  context?: Record<string, unknown>;
}

export function AIAssistButton({ field, onSuggestion, context }: AIAssistButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();
  const { openCopilot } = useBee();

  const handleAssist = async () => {
    if (!user) {
      toast.error(t("ai.loginRequired"));
      return;
    }

    setIsGenerating(true);
    try {
      const suggestion = `Suggested direction for ${field}: keep this concise, specific, and tied to the user's real business context. Mention the problem, audience, evidence, and the next action instead of writing vague filler.`;
      onSuggestion(suggestion);
      openCopilot(
        `Help me improve the "${field}" field. Current context: ${JSON.stringify(context ?? {}).slice(0, 280)}`
      );
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
      className="h-8 rounded-full border-primary/20 bg-primary/10 px-3 text-primary hover:bg-primary/15 hover:text-primary"
    >
      {isGenerating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
      <span className="text-xs">{t("ai.assist")}</span>
    </Button>
  );
}
