/**
 * Catalog Types - Shared between Backend and Frontend
 *
 * These types match the API response structures defined in API_CONTRACT.md
 */

// ============================================================================
// Enums
// ============================================================================

export type PlanStatus = "ACTIVE" | "RETIRED";
export type FeatureType = "BOOLEAN" | "NUMERIC" | "TEXT";
export type BillingPeriod = "MONTHLY" | "QUARTERLY" | "ANNUAL" | "USAGE";
export type PricingModel = "RECURRING" | "USAGE" | "TIERED" | "HYBRID";
export type MigrationStrategy = "GRANDFATHER" | "NOTIFY_MIGRATE" | "IMMEDIATE";

// ============================================================================
// Feature Types
// ============================================================================

export interface Feature {
  id: string;
  tenantId: string;
  featureKey: string; // kebab-case, unique per tenant
  type: FeatureType;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  defaultValue?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateFeatureRequest {
  featureKey: string;
  type: FeatureType;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  defaultValue?: string;
}

export interface UpdateFeatureRequest {
  nameEn?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  defaultValue?: string;
}

// Form data type (for create and update)
export type FeatureFormData = CreateFeatureRequest;

// ============================================================================
// Plan Types
// ============================================================================

export interface Plan {
  id: string;
  tenantId: string;
  planKey: string; // kebab-case, unique per tenant (this IS the Kill Bill Product)
  version: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  killBillProductId?: string | null; // Kill Bill Product UUID (set after sync)
  status: PlanStatus;
  migrationStrategy: MigrationStrategy;
  effectiveFrom: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  // Relations (populated in detail view)
  features?: PlanFeature[];
  pricing?: Pricing[]; // Multiple pricing options (each IS a Kill Bill Plan)
}

export interface PlanSummary {
  id: string;
  planKey: string;
  version: number;
  nameEn: string;
  nameAr: string;
  status: PlanStatus;
  createdAt: string;
  // Note: billingPeriod is on Pricing model, not Plan
}

export interface CreatePlanRequest {
  planKey?: string; // Optional - backend auto-generates from nameEn if not provided
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  migrationStrategy?: MigrationStrategy; // Optional - only for versioning
  effectiveFrom?: string; // ISO date
  pricing?: CreatePricingRequest[]; // Optional - inline pricing creation
}

export interface UpdatePlanRequest {
  nameEn?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  trialPeriodDays?: number;
}

// Form data type (for create)
export type PlanFormData = CreatePlanRequest;

export interface CreatePlanVersionRequest {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  migrationStrategy: MigrationStrategy;
  effectiveFrom: string; // ISO date, must be future
  pricing?: CreatePricingRequest[]; // Optional - inline pricing for new version
}

export interface RetirePlanRequest {
  effectiveDate: string; // ISO date
}

// ============================================================================
// Plan-Feature Linking
// ============================================================================

export interface PlanFeature {
  id: string;
  planId: string;
  featureId: string;
  overrideValue: string | null;
  createdAt: string;
  updatedAt: string;
  // Populated relations
  feature?: Feature;
}

export interface AddFeatureToPlanRequest {
  featureId: string;
  overrideValue?: string;
}

export interface UpdateFeatureOverrideRequest {
  overrideValue: string;
}

// ============================================================================
// Pricing Types
// ============================================================================

export interface Pricing {
  id: string;
  planId: string;
  model: PricingModel;
  billingPeriod: BillingPeriod | null; // For RECURRING pricing
  currency: string | null; // ISO 4217 (SAR, USD, etc.)
  amount: string | null; // Decimal as string (main price field)
  trialDays: number | null; // Free trial period
  setupFee: string | null; // One-time setup fee
  perUnitCost: string | null; // For USAGE pricing
  usageUnit: string | null; // e.g., "api-calls", "storage-gb"
  tiers: PricingTier[] | null; // For TIERED pricing
  killBillPlanId?: string | null; // Kill Bill Plan UUID (this IS a KB Plan)
  createdAt: string;
  updatedAt: string;
}

export interface PricingTier {
  upTo: number; // Upper limit (null = infinity)
  price: string; // Decimal as string
}

export interface CreatePricingRequest {
  model: PricingModel;
  billingPeriod?: BillingPeriod; // For RECURRING
  currency?: string; // Default: SAR
  basePrice: number;
  trialDays?: number;
  setupFee?: number;
  unitPrice?: number; // For USAGE/HYBRID
  usageUnit?: string; // For USAGE/HYBRID
  tiers?: PricingTier[]; // For TIERED
}

export interface AddPricingRequest extends CreatePricingRequest {}

export interface UpdatePricingRequest {
  basePrice?: number;
  unitPrice?: number;
  tiers?: PricingTier[];
}

// ============================================================================
// Catalog Sync Types
// ============================================================================

export interface CatalogSync {
  id: string;
  tenantId: string;
  status: "SUCCESS" | "FAILED";
  xml: string | null;
  errorMessage: string | null;
  createdAt: string;
  createdBy: string;
}

export interface SyncCatalogRequest {
  validate?: boolean; // Default: true
}

export interface SyncCatalogResponse {
  syncId: string;
  success: boolean;
  xml?: string;
  error?: string;
  validationErrors?: string[];
}
