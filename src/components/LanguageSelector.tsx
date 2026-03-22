import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "es", name: "Español (Spanish)" },
  { code: "fr", name: "Français (French)" },
  { code: "de", name: "Deutsch (German)" },
  { code: "zh", name: "中文 (Chinese)" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "ru", name: "Русский (Russian)" },
  { code: "pt", name: "Português (Portuguese)" },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-background/50 backdrop-blur border">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={i18n.language === lang.code ? "bg-accent font-medium" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}