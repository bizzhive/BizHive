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
    const previousLanguage = i18n.resolvedLanguage;
    await i18n.changeLanguage(code);

    if (!user) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ preferred_language: code })
      .eq("user_id", user.id);

    if (error) {
      await i18n.changeLanguage(previousLanguage);
      toast({
        title: t("Language update failed"),
        description: t("We could not save your language preference."),
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full h-10 px-3 bg-background/50 backdrop-blur border text-foreground hover:bg-accent hover:text-accent-foreground gap-2">
          <Globe className="h-5 w-5" />
          <span className="text-sm font-bold">{activeLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={i18n.resolvedLanguage === lang.code ? "bg-accent font-medium" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
