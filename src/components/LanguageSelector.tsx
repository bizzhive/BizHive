import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { supportedLanguages } from "@/i18n";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const activeLanguage = supportedLanguages.find((language) => language.code === i18n.resolvedLanguage) ?? supportedLanguages[0];

  const handleLanguageChange = (code: string) => {
    void i18n.changeLanguage(code);
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
