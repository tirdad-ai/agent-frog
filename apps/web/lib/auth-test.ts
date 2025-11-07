/**
 * Test-Aware Auth Helper
 *
 * ⚠️ TEST ONLY: Allows mock auth headers in test environment
 * DO NOT USE IN PRODUCTION
 */

import { auth as nextAuth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function getSession(req?: NextRequest) {
  // ⚠️ TEST ONLY: Check for mock auth headers in test environment
  // Use TEST_MODE instead of NODE_ENV because Next.js forces NODE_ENV in dev mode
  if (process.env.TEST_MODE === "true" && req) {
    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");
    const tenantId = req.headers.get("x-tenant-id");

    if (userId && role && tenantId) {
      // Return mock session for integration tests
      return {
        user: {
          id: userId,
          email: "test@example.com",
          name: "Test User",
        },
        currentTenant: {
          id: tenantId,
          name: "Test Tenant",
          slug: "test-tenant",
        },
        membership: {
          role: role as any,
          isActive: true,
        },
      };
    }
  }

  // Production: Use real NextAuth session
  return await nextAuth();
}
