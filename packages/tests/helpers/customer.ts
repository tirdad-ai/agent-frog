/**
 * Customer & Subscription Test Helpers
 *
 * Utilities for creating test customers and subscriptions
 */

import { prisma, hashPassword } from "@repo/database";

/**
 * Create test customer with subscription to a plan
 */
export async function createTestCustomer(data: {
  tenantId: string;
  email: string;
  name: string;
  planKey: string; // Plan.planKey (e.g., 'free-plan', 'pro-plan')
  password?: string;
}) {
  const hashedPassword = await hashPassword(data.password || "Customer@123");

  // Get the plan
  const plan = await prisma.plan.findFirst({
    where: {
      tenantId: data.tenantId,
      planKey: data.planKey,
      status: "ACTIVE",
    },
    orderBy: {
      version: "desc",
    },
  });

  if (!plan) {
    throw new Error(
      `Plan not found: ${data.planKey} for tenant ${data.tenantId}`,
    );
  }

  // Create customer
  const customer = await prisma.customer.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      locale: "en",
      timezone: "UTC",
    },
  });

  // Create subscription
  const subscription = await prisma.subscription.create({
    data: {
      tenantId: data.tenantId,
      customerId: customer.id,
      planId: plan.id,
      planKey: plan.planKey,
      planVersion: plan.version,
      status: "ACTIVE",
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    include: {
      plan: true,
      customer: true,
    },
  });

  return { customer, subscription, plan };
}

/**
 * Create test customer without subscription
 */
export async function createCustomerWithoutSubscription(data: {
  email: string;
  name: string;
  password?: string;
}) {
  const hashedPassword = await hashPassword(data.password || "Customer@123");

  return prisma.customer.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      locale: "en",
      timezone: "UTC",
    },
  });
}

/**
 * Create subscription for existing customer
 */
export async function createSubscription(data: {
  tenantId: string;
  customerId: string;
  planKey: string;
  status?: "ACTIVE" | "CANCELLING" | "CANCELLED" | "PAST_DUE";
}) {
  // Get the plan
  const plan = await prisma.plan.findFirst({
    where: {
      tenantId: data.tenantId,
      planKey: data.planKey,
      status: "ACTIVE",
    },
    orderBy: {
      version: "desc",
    },
  });

  if (!plan) {
    throw new Error(
      `Plan not found: ${data.planKey} for tenant ${data.tenantId}`,
    );
  }

  return prisma.subscription.create({
    data: {
      tenantId: data.tenantId,
      customerId: data.customerId,
      planId: plan.id,
      planKey: plan.planKey,
      planVersion: plan.version,
      status: data.status || "ACTIVE",
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    include: {
      plan: true,
    },
  });
}

/**
 * Get or create default test plans for tenant
 *
 * Creates basic catalog plans (free-plan, pro-plan, enterprise-plan)
 * if they don't exist for the tenant
 */
export async function ensureTenantPlans(tenantId: string) {
  const existingPlans = await prisma.plan.count({
    where: { tenantId },
  });

  if (existingPlans > 0) {
    return; // Plans already exist
  }

  // Create basic plans
  const plans = [
    {
      planKey: "free-plan",
      nameEn: "Free Plan",
      nameAr: "خطة مجانية",
      descriptionEn: "Basic features for getting started",
      descriptionAr: "ميزات أساسية للبدء",
    },
    {
      planKey: "pro-plan",
      nameEn: "Pro Plan",
      nameAr: "خطة احترافية",
      descriptionEn: "Advanced features for growing businesses",
      descriptionAr: "ميزات متقدمة للشركات المتنامية",
    },
    {
      planKey: "enterprise-plan",
      nameEn: "Enterprise Plan",
      nameAr: "خطة المؤسسات",
      descriptionEn: "Full features for large organizations",
      descriptionAr: "ميزات كاملة للمؤسسات الكبيرة",
    },
  ];

  for (const plan of plans) {
    await prisma.plan.create({
      data: {
        tenantId,
        planKey: plan.planKey,
        nameEn: plan.nameEn,
        nameAr: plan.nameAr,
        descriptionEn: plan.descriptionEn,
        descriptionAr: plan.descriptionAr,
        status: "ACTIVE",
        version: 1,
        effectiveDate: new Date(),
        migrationStrategy: "GRANDFATHER",
        createdBy: "system-test",
      },
    });
  }
}

/**
 * Clean up customer test data
 */
export async function cleanupCustomers() {
  await prisma.subscription.deleteMany({});
  await prisma.customer.deleteMany({});
}
