import { PrismaClient } from "@prisma/client";

// Session context type
export interface SessionContext {
  userId: string;
  tenantId?: string;
  role: "SUPER_ADMIN" | "TENANT_ADMIN" | "TENANT_STAFF";
}

// Models that should NOT have tenantId filter applied
const EXCLUDED_MODELS = ["PlanVersion"];

// Prisma client singleton
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;

/**
 * Creates a Prisma client with multi-tenancy middleware
 *
 * @param session - The current user session context
 * @returns Prisma client with RLS middleware applied
 */
export function createPrismaClient(session?: SessionContext) {
  const client = prisma;

  // Only apply middleware if session is provided and user is not Super Admin
  if (session && session.role !== "SUPER_ADMIN") {
    // Validate that tenantId exists for non-Super Admin users
    if (!session.tenantId) {
      throw new Error(
        "tenantId required in session context for non-Super Admin users",
      );
    }

    // Apply multi-tenancy middleware
    client.$use(async (params, next) => {
      const tenantId = session.tenantId!;

      // Skip middleware for excluded models
      if (EXCLUDED_MODELS.includes(params.model || "")) {
        return next(params);
      }

      // Handle read operations
      if (
        ["findUnique", "findFirst", "findMany", "count", "aggregate"].includes(
          params.action,
        )
      ) {
        // Initialize args if not present
        if (!params.args) {
          params.args = {};
        }

        // Add tenantId filter
        if (
          params.action === "findMany" ||
          params.action === "findFirst" ||
          params.action === "count"
        ) {
          // For queries with existing where clause
          if (params.args.where) {
            // Wrap existing where in AND with tenantId filter
            params.args.where = {
              AND: [params.args.where, { tenantId }],
            };
          } else {
            // No existing where clause, just add tenantId
            params.args.where = { tenantId };
          }
        } else if (params.action === "findUnique") {
          // For findUnique, add tenantId to where
          if (params.args.where) {
            params.args.where = {
              ...params.args.where,
              tenantId,
            };
          }
        }
      }

      // Handle write operations
      if (["create", "createMany"].includes(params.action)) {
        // Auto-inject tenantId on create
        if (params.action === "create") {
          if (!params.args) {
            params.args = {};
          }
          params.args.data = {
            ...params.args.data,
            tenantId,
          };
        } else if (params.action === "createMany") {
          if (!params.args) {
            params.args = {};
          }
          // Inject tenantId for each record
          if (Array.isArray(params.args.data)) {
            params.args.data = params.args.data.map((record: any) => ({
              ...record,
              tenantId,
            }));
          } else {
            params.args.data = {
              ...params.args.data,
              tenantId,
            };
          }
        }
      }

      // Handle update operations
      if (["update", "updateMany", "upsert"].includes(params.action)) {
        if (!params.args) {
          params.args = {};
        }

        // Add tenantId filter to where clause
        if (params.action === "update" || params.action === "updateMany") {
          if (params.args.where) {
            params.args.where = {
              AND: [params.args.where, { tenantId }],
            };
          } else {
            params.args.where = { tenantId };
          }
        } else if (params.action === "upsert") {
          // For upsert, add tenantId to both where and create
          if (params.args.where) {
            params.args.where = {
              ...params.args.where,
              tenantId,
            };
          }
          if (params.args.create) {
            params.args.create = {
              ...params.args.create,
              tenantId,
            };
          }
        }
      }

      // Handle delete operations
      if (["delete", "deleteMany"].includes(params.action)) {
        if (!params.args) {
          params.args = {};
        }

        // Add tenantId filter to where clause
        if (params.args.where) {
          params.args.where = {
            AND: [params.args.where, { tenantId }],
          };
        } else {
          params.args.where = { tenantId };
        }
      }

      return next(params);
    });
  }

  return client;
}

/**
 * Helper to create audit log
 *
 * @param data - Audit log data
 */
export async function createAuditLog(data: {
  userId: string;
  tenantId: string;
  action: string;
  resource: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      tenantId: data.tenantId,
      action: data.action as any, // Cast to AuditAction enum
      resource: data.resource,
      metadata: data.metadata || {},
      ipAddress: data.ipAddress || "0.0.0.0",
      userAgent: data.userAgent || "Unknown",
    },
  });
}

export { PrismaClient };
