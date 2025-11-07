/**
 * Auth Test Helper
 *
 * Utilities for authentication in tests
 */

/**
 * Generate mock auth headers for API testing
 */
export function getMockAuthHeaders(params: {
  tenantId: string;
  userId: string;
  role: "SUPER_ADMIN" | "TENANT_ADMIN" | "TENANT_STAFF";
}) {
  return {
    "x-tenant-id": params.tenantId,
    "x-user-id": params.userId,
    "x-user-role": params.role,
  };
}

/**
 * Generate tenant admin auth headers
 */
export function getTenantAdminHeaders(tenantId: string, userId: string) {
  return getMockAuthHeaders({
    tenantId,
    userId,
    role: "TENANT_ADMIN",
  });
}

/**
 * Generate super admin auth headers
 */
export function getSuperAdminHeaders(userId: string) {
  return getMockAuthHeaders({
    tenantId: "tenant_platform",
    userId,
    role: "SUPER_ADMIN",
  });
}

/**
 * Create authenticated request with user context
 * Automatically determines role and tenantId from database
 */
export async function createAuthenticatedRequest(
  userId: string,
  options: {
    url: string;
    method: string;
    body?: string;
  },
) {
  const { prisma } = await import("@repo/database");

  // Fetch user with memberships to get role and tenantId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        where: { isActive: true },
        include: { tenant: true },
        orderBy: [
          { lastAccessedAt: { sort: "desc", nulls: "last" } },
          { createdAt: "asc" },
        ],
      },
    },
  });

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  if (!user.memberships || user.memberships.length === 0) {
    throw new Error(`User has no active memberships: ${userId}`);
  }

  // Use first membership (default tenant)
  const membership = user.memberships[0];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-tenant-id": membership.tenantId,
    "x-user-id": user.id,
    "x-user-role": membership.role,
  };

  return fetch(options.url, {
    method: options.method,
    headers,
    body: options.body,
  });
}
