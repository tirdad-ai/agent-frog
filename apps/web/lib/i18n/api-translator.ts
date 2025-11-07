/**
 * API i18n Helper
 *
 * Provides localized error messages for API routes based on Accept-Language header
 */

import { NextRequest } from "next/server";
import { getTranslations } from "next-intl/server";

/**
 * Extract locale from Accept-Language header
 * Falls back to 'en' if not found or unsupported
 */
export function getLocaleFromRequest(request: NextRequest): "en" | "ar" {
  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage) return "en";

  // Parse Accept-Language header (e.g., "ar,en;q=0.9,en-US;q=0.8")
  const primaryLang = acceptLanguage
    .split(",")[0]
    ?.split("-")[0]
    ?.split(";")[0]
    ?.trim();

  return primaryLang === "ar" ? "ar" : "en";
}

/**
 * Get translated error message for API routes
 *
 * @example
 * const t = await getApiTranslator(request)
 * return NextResponse.json(
 *   { error: { code: 'EMAIL_EXISTS', message: t('errors.emailExists') } },
 *   { status: 400 }
 * )
 */
export async function getApiTranslator(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "common" });

  return t;
}

/**
 * Standard API error responses with i18n support
 */
export async function createApiError(
  request: NextRequest,
  code: string,
  translationKey: string,
  status: number,
) {
  const t = await getApiTranslator(request);

  return {
    error: {
      code,
      message: t(translationKey),
    },
    status,
  };
}
