import { LOCALES } from "./constants";

/**
 * Supported locale type
 */
export type Locale = (typeof LOCALES)[number];

/**
 * I18n configuration options
 */
export interface I18nConfig {
  /**
   * List of supported locales
   */
  locales: readonly string[];

  /**
   * Default locale to use
   */
  defaultLocale: string;

  /**
   * Whether to always show locale prefix in URLs
   * @default 'always'
   */
  localePrefix?: "always" | "as-needed" | "never";

  /**
   * Path to messages directory relative to app root
   * @default '../messages'
   */
  messagesPath?: string;
}

/**
 * Routing configuration for i18n
 */
export interface I18nRoutingConfig {
  locales: readonly string[];
  defaultLocale: string;
  localePrefix?: "always" | "as-needed" | "never";
}
