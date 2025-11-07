import { z } from "zod";

/**
 * Signup validation schema
 */
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long")
    .refine((val) => !/[<>]/.test(val), "Name cannot contain HTML tags"),

  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .refine((val) => !/['";]/.test(val), "Email contains invalid characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be at most 128 characters long")
    .refine(
      (val) => /[A-Z]/.test(val),
      "Password must contain at least one uppercase letter",
    )
    .refine(
      (val) => /[0-9]/.test(val),
      "Password must contain at least one number",
    ),

  company: z
    .string()
    .min(2, "Company name must be at least 2 characters long")
    .max(100, "Company name must be at most 100 characters long")
    .refine(
      (val) => !/[<>]/.test(val),
      "Company name cannot contain HTML tags",
    ),

  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),

  locale: z.enum(["en", "ar"]).optional().default("en"),
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .refine((val) => !/['";]/.test(val), "Email contains invalid characters"),

  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
});

export type PasswordResetRequestInput = z.infer<
  typeof passwordResetRequestSchema
>;

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be at most 128 characters long")
    .refine(
      (val) => /[A-Z]/.test(val),
      "Password must contain at least one uppercase letter",
    )
    .refine(
      (val) => /[0-9]/.test(val),
      "Password must contain at least one number",
    ),
});

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

/**
 * Tenant update schema
 */
export const tenantUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long")
    .refine((val) => !/[<>]/.test(val), "Name cannot contain HTML tags")
    .optional(),

  timezone: z.string().min(1, "Timezone is required").optional(),

  defaultLocale: z.enum(["en", "ar"]).optional(),
});

export type TenantUpdateInput = z.infer<typeof tenantUpdateSchema>;

/**
 * Plan subscription schema
 */
export const planSubscriptionSchema = z.object({
  planSlug: z.enum(["FREE", "STARTER", "PRO"], {
    errorMap: () => ({ message: "Invalid plan selected" }),
  }),

  migrationStrategy: z
    .enum(["GRANDFATHER", "NOTIFY_AND_MIGRATE", "IMMEDIATE", "HYBRID"], {
      errorMap: () => ({ message: "Invalid migration strategy" }),
    })
    .optional(),
});

export type PlanSubscriptionInput = z.infer<typeof planSubscriptionSchema>;

/**
 * Admin tenant status update schema
 */
export const adminTenantStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "PENDING"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),

  reason: z
    .string()
    .min(1, "Reason is required")
    .max(500, "Reason must be at most 500 characters")
    .optional(),
});

export type AdminTenantStatusInput = z.infer<typeof adminTenantStatusSchema>;

/**
 * Admin tenant limits override schema
 */
export const adminTenantLimitsSchema = z.object({
  maxCustomers: z
    .number()
    .int("Max customers must be an integer")
    .min(1, "Max customers must be at least 1")
    .max(1000000, "Max customers must be at most 1,000,000"),
});

export type AdminTenantLimitsInput = z.infer<typeof adminTenantLimitsSchema>;

/**
 * Kill Bill configuration schema
 */
export const killBillConfigSchema = z.object({
  apiKey: z
    .string()
    .min(1, "API key is required")
    .max(255, "API key must be at most 255 characters"),

  apiSecret: z
    .string()
    .min(1, "API secret is required")
    .max(255, "API secret must be at most 255 characters"),

  url: z.string().url("Invalid URL").optional(),
});

export type KillBillConfigInput = z.infer<typeof killBillConfigSchema>;
