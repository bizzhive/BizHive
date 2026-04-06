import { enTranslation, type TranslationDictionary } from "@/locales/en";
import { guTranslation } from "@/locales/gu";
import { hiTranslation } from "@/locales/hi";
import { knTranslation } from "@/locales/kn";
import { mergeLocale } from "@/locales/merge";
import { supportedLanguageCodes, supportedLanguages, type AppLocale } from "@/locales/manifest";
import { mrTranslation } from "@/locales/mr";
import { taTranslation } from "@/locales/ta";
import { teTranslation } from "@/locales/te";

export type { AppLocale } from "@/locales/manifest";
export { supportedLanguageCodes, supportedLanguages } from "@/locales/manifest";

export const localeResources: Record<AppLocale, { translation: TranslationDictionary }> = {
  en: { translation: enTranslation },
  gu: { translation: mergeLocale(enTranslation, guTranslation) },
  hi: { translation: mergeLocale(enTranslation, hiTranslation) },
  kn: { translation: mergeLocale(enTranslation, knTranslation) },
  mr: { translation: mergeLocale(enTranslation, mrTranslation) },
  ta: { translation: mergeLocale(enTranslation, taTranslation) },
  te: { translation: mergeLocale(enTranslation, teTranslation) },
};
