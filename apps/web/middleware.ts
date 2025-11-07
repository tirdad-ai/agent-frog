/**
 * NextAuth.js v5 Middleware + i18n Locale Detection
 *
 * Protects routes, enforces authorization rules, and handles locale routing
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@repo/i18n/routing";

// Create i18n middleware
const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = auth((req: any) => {
  let session = req.auth;
  const path = req.nextUrl.pathname;

  // ⚠️ TEST ONLY - Mock Auth Bypass
  // Allows integration tests to use mock headers instead of real JWT tokens
  // DO NOT ENABLE IN PRODUCTION - Security risk
  if (process.env.NODE_ENV === "test" && path.startsWith("/api")) {
    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");
    const tenantId = req.headers.get("x-tenant-id");

    if (userId && role && tenantId) {
      // Create mock session for tests with membership structure
      session = {
        user: {
          id: userId,
          email: `test-${userId}@test.com`,
          name: `Test User ${userId}`,
        },
        currentTenant: {
          id: tenantId,
          name: "Test Tenant",
          slug: "test-tenant",
        },
        membership: {
          role: role,
          isActive: true,
        },
      };
      req.auth = session; // Inject mock session
    }
  }

  // Skip locale handling for API routes and static files
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Extract locale from path (e.g., /en/auth/login → en)
  const localeMatch = path.match(/^\/(en|ar)(\/|$)/);
  const pathWithoutLocale = localeMatch ? path.replace(/^\/(en|ar)/, "") : path;

  // Public routes (no auth required) - check without locale prefix
  const publicRoutes = ["/auth/login", "/auth/signup", "/auth/error"];
  if (publicRoutes.some((route) => pathWithoutLocale.startsWith(route))) {
    // Apply locale middleware to public routes
    return intlMiddleware(req);
  }

  // Require authentication for all other routes
  if (!session?.user) {
    const locale = localeMatch ? localeMatch[1] : "en";
    const loginUrl = new URL(`/${locale}/auth/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Super Admin routes (check path without locale)
  if (pathWithoutLocale.startsWith("/admin")) {
    if (session.membership?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Super Admin only" } },
        { status: 403 },
      );
    }
  }

  // Tenant Admin routes
  if (
    pathWithoutLocale.startsWith("/api/v1/tenants") ||
    pathWithoutLocale.startsWith("/api/v1/plans/subscribe")
  ) {
    if (
      session.membership?.role !== "TENANT_ADMIN" &&
      session.membership?.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Tenant Admin or Super Admin only",
          },
        },
        { status: 403 },
      );
    }
  }

  // Apply locale middleware to authenticated routes
  return intlMiddleware(req);
}) as any; // NextAuth v5 middleware type

export default authMiddleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
