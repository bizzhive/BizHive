export type AppLocale = "en" | "hi" | "gu" | "kn" | "te" | "mr" | "ta";

export type LocaleDirection = "ltr" | "rtl";

export type SupportedLanguage = {
  code: AppLocale;
  dir: LocaleDirection;
  name: string;
  shortLabel: string;
};

export const supportedLanguages: readonly SupportedLanguage[] = [
  { code: "en", dir: "ltr", name: "English", shortLabel: "EN" },
  { code: "hi", dir: "ltr", name: "हिन्दी", shortLabel: "HI" },
  { code: "gu", dir: "ltr", name: "ગુજરાતી", shortLabel: "GU" },
  { code: "kn", dir: "ltr", name: "ಕನ್ನಡ", shortLabel: "KN" },
  { code: "te", dir: "ltr", name: "తెలుగు", shortLabel: "TE" },
  { code: "mr", dir: "ltr", name: "मराठी", shortLabel: "MR" },
  { code: "ta", dir: "ltr", name: "தமிழ்", shortLabel: "TA" },
] as const;

export const supportedLanguageCodes = supportedLanguages.map((language) => language.code);
