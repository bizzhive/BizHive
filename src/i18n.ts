import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { localeResources, supportedLanguageCodes, supportedLanguages } from "@/locales";

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: localeResources,
  fallbackLng: "en",
  supportedLngs: supportedLanguageCodes,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

export { supportedLanguages };
export default i18n;
