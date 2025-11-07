/**
 * i18n Configuration for Web App
 *
 * Integrates @repo/i18n package with Next.js 15 App Router
 */

import { createI18nConfig } from "@repo/i18n/config";

// Create i18n config for console app (tenant/business owner dashboard)
export default createI18nConfig("console");
