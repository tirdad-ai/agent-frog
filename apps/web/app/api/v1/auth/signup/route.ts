/**
 * POST /api/v1/auth/signup
 *
 * Register new tenant and admin user (thin API route)
 */

import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@repo/services";
import { getApiTranslator } from "@/lib/i18n/api-translator";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract metadata from request
    const metadata = {
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "0.0.0.0",
      userAgent: request.headers.get("user-agent") || "Unknown",
    };

    // Delegate to service
    const result = await authService.signup(body, metadata);

    // Return user data - client will handle NextAuth sign-in
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    const t = await getApiTranslator(request);

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: t("errors.validationError"),
            details: error.errors,
          },
        },
        { status: 400 },
      );
    }

    // Handle business logic errors
    if (error.message.includes("already exists")) {
      return NextResponse.json(
        {
          error: {
            code: "CONFLICT",
            message: t("errors.emailExists"),
          },
        },
        { status: 409 },
      );
    }

    // Handle unexpected errors
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: t("errors.internalError"),
        },
      },
      { status: 500 },
    );
  }
}
