import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { supportedLanguages } from "@/i18n";

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const activeLanguage = supportedLanguages.find((language) => language.code === i18n.resolvedLanguage) ?? supportedLanguages[0];

  const handleLanguageChange = async (code: string) => {
    await i18n.changeLanguage(code);

    if (!user) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ preferred_language: code })
      .eq("user_id", user.id);

    if (error) {
      console.error("Unable to persist preferred language:", error);
      toast({
        title: t("Language update failed"),
        description: t("Saved on this device for now. We'll sync it to your profile later."),
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-11 rounded-2xl border-border/70 bg-background/75 px-3.5 text-foreground shadow-sm backdrop-blur hover:bg-accent hover:text-accent-foreground"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-bold tracking-wide">{activeLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border-border/70 bg-background/96 p-1 shadow-[0_18px_48px_rgba(16,12,8,0.16)]">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`rounded-xl ${i18n.resolvedLanguage === lang.code ? "bg-accent font-medium" : ""}`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
