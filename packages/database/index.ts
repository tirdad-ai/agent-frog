/**
 * Database Package
 *
 * Exports Prisma client, types, and utilities
 */

// Export Prisma client
export { default as prisma } from "./lib/prisma";

// Export Prisma namespace (for Prisma.Decimal, etc.)
export { Prisma, PrismaClient } from "@prisma/client";

// Export Prisma types
export type {
  User,
  Tenant,
  TenantMembership,
  PlanVersion,
  AuditLog,
  Role,
  TenantStatus,
  TenantPlan,
  MigrationStrategy,
  AuditAction,
  // R2 Catalog Management Types
  Feature,
  Plan,
  PlanFeature,
  Pricing,
  CatalogSync,
  PlanStatus,
  FeatureType,
  BillingPeriod,
  PricingModel,
} from "@prisma/client";

// Export utilities
export * from "./lib/crypto";
export * from "./lib/validations/auth";
