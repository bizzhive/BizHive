import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { supportedLanguages } from "@/i18n";

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const activeLanguage =
    supportedLanguages.find((language) => language.code === i18n.resolvedLanguage) ??
    supportedLanguages[0];

  const handleLanguageChange = async (code: string) => {
    await i18n.changeLanguage(code);

    if (!user) {
      return;
    }

    const { error } = await supabase.from("profiles").update({ preferred_language: code }).eq("user_id", user.id);

    if (error) {
      toast({
        title: t("common.languageSaveFailed"),
        description: t("common.languageSaveFallback"),
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 rounded-2xl border border-border/80 px-3 text-sm font-semibold">
          <Globe className="mr-2 h-4 w-4" />
          {activeLanguage.shortLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-2xl border-border/80 bg-card p-1">
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="rounded-xl px-3 py-2"
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
