/**
 * Supported locales for the application
 */
export const LOCALES = ["en", "ar"] as const;

/**
 * Default locale when none is specified
 */
export const DEFAULT_LOCALE = "en" as const;

/**
 * Locale display names
 */
export const LOCALE_NAMES: Record<string, { native: string; english: string }> =
  {
    en: {
      native: "English",
      english: "English",
    },
    ar: {
      native: "العربية",
      english: "Arabic",
    },
  };

/**
 * Text direction for each locale
 */
export const LOCALE_DIRECTIONS: Record<string, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};
