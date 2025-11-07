import { getRequestConfig as getNextIntlRequestConfig } from "next-intl/server";
import { LOCALES, DEFAULT_LOCALE } from "./constants";
import type { Locale, I18nConfig } from "./types";

// Import translations directly from message files
import sharedAuthEn from "../messages/shared/en/auth.json";
import sharedCommonEn from "../messages/shared/en/common.json";
import sharedErrorsEn from "../messages/shared/en/errors.json";
import sharedNavigationEn from "../messages/shared/en/navigation.json";

import sharedAuthAr from "../messages/shared/ar/auth.json";
import sharedCommonAr from "../messages/shared/ar/common.json";
import sharedErrorsAr from "../messages/shared/ar/errors.json";
import sharedNavigationAr from "../messages/shared/ar/navigation.json";

import consoleAccountEn from "../messages/console/en/account.json";
import consoleDashboardEn from "../messages/console/en/dashboard.json";
import consoleNavigationEn from "../messages/console/en/navigation.json";
import consolePaymentGatewaysEn from "../messages/console/en/payment-gateways.json";
import consoleSetupEn from "../messages/console/en/setup.json";
import consoleCatalogEn from "../messages/console/en/Catalog.json";

import consoleAccountAr from "../messages/console/ar/account.json";
import consoleDashboardAr from "../messages/console/ar/dashboard.json";
import consoleNavigationAr from "../messages/console/ar/navigation.json";
import consolePaymentGatewaysAr from "../messages/console/ar/payment-gateways.json";
import consoleSetupAr from "../messages/console/ar/setup.json";
import consoleCatalogAr from "../messages/console/ar/Catalog.json";

/**
 * Combine shared messages with proper namespacing for next-intl
 */
const sharedEn = {
  auth: sharedAuthEn,
  common: sharedCommonEn,
  errors: sharedErrorsEn,
  navigation: sharedNavigationEn,
};

const sharedAr = {
  auth: sharedAuthAr,
  common: sharedCommonAr,
  errors: sharedErrorsAr,
  navigation: sharedNavigationAr,
};

/**
 * Combine console messages with proper namespacing
 */
const consoleEn = {
  account: consoleAccountEn,
  dashboard: consoleDashboardEn,
  console_navigation: consoleNavigationEn,
  payment_gateways: consolePaymentGatewaysEn,
  setup: consoleSetupEn,
  Catalog: consoleCatalogEn,
};

const consoleAr = {
  account: consoleAccountAr,
  dashboard: consoleDashboardAr,
  console_navigation: consoleNavigationAr,
  payment_gateways: consolePaymentGatewaysAr,
  setup: consoleSetupAr,
  Catalog: consoleCatalogAr,
};

/**
 * Messages map by app and locale
 */
const messagesMap = {
  admin: {
    en: { ...sharedEn }, // TODO: Add admin-specific messages
    ar: { ...sharedAr },
  },
  portal: {
    en: { ...sharedEn }, // TODO: Add portal-specific messages
    ar: { ...sharedAr },
  },
  console: {
    en: { ...sharedEn, ...consoleEn },
    ar: { ...sharedAr, ...consoleAr },
  },
};

/**
 * Default i18n configuration
 */
export const defaultI18nConfig: I18nConfig = {
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  messagesPath: "../messages",
};

/**
 * Create a getRequestConfig function for next-intl
 * This loads shared translations plus app-specific translations
 *
 * @param appName - App name ('admin' or 'portal')
 * @returns Configured getRequestConfig function
 *
 * @example
 * ```ts
 * // In apps/admin/src/i18n.ts
 * import { createI18nConfig } from '@repo/i18n/config'
 *
 * export default createI18nConfig('admin')
 * ```
 */
export function createI18nConfig(appName: "admin" | "portal" | "console") {
  return getNextIntlRequestConfig(async ({ requestLocale }) => {
    // Use the new requestLocale API for Next.js 15 compatibility
    let locale = await requestLocale;

    // Validate that the incoming locale parameter is valid
    if (!locale || !LOCALES.includes(locale as Locale)) {
      locale = DEFAULT_LOCALE;
    }

    // Get messages from pre-loaded map
    const messages = messagesMap[appName][locale as Locale];

    return {
      messages,
      locale,
    };
  });
}

/**
 * Validate if a locale string is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

/**
 * Get a valid locale or return default
 */
export function getValidLocale(locale: string | undefined | null): Locale {
  if (!locale) return DEFAULT_LOCALE;
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}

/**
 * Re-export constants and types for convenience
 */
export { LOCALES, DEFAULT_LOCALE } from "./constants";
export type { Locale } from "./types";
