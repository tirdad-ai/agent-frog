/**
 * Database Test Helper
 *
 * Utilities for test database setup and teardown
 */

import { prisma, hashPassword } from "@repo/database";

/**
 * Test database helper object
 */
export const testDb = {
  prisma,
  connect: async () => {
    await prisma.$connect();
  },
  disconnect: async () => {
    await prisma.$disconnect();
  },
  reset: async () => {
    await clearDatabase();
  },
  seed: async () => {
    await seedPlatform();
    await createSuperAdmin();
  },
};

/**
 * Clear all test data
 */
export async function clearDatabase() {
  // Delete in reverse dependency order
  await prisma.auditLog.deleteMany({});

  // Catalog tables (wrapped in try-catch in case tables don't exist)
  try {
    await prisma.catalogSync.deleteMany({});
    await prisma.pricing.deleteMany({});
    await prisma.planFeature.deleteMany({});
    await prisma.plan.deleteMany({});
    await prisma.feature.deleteMany({});
    // Note: 'service' model was removed in R2 catalog restructuring
  } catch (error) {
    // Ignore if catalog tables don't exist in test DB
  }

  // User and tenant tables
  await prisma.user.deleteMany({}); // Delete ALL users including platform users
  await prisma.tenant.deleteMany({ where: { id: { not: "tenant_platform" } } });
  // Keep platform tenant and plans only
}

/**
 * Seed platform tenant and plans (if not exists)
 */
export async function seedPlatform() {
  // Check if platform exists
  const platformExists = await prisma.tenant.findUnique({
    where: { id: "tenant_platform" },
  });

  if (!platformExists) {
    // Create platform tenant
    await prisma.tenant.create({
      data: {
        id: "tenant_platform",
        name: "Tirdad Platform",
        slug: "tirdad-platform",
        status: "ACTIVE",
        plan: "PRO",
        maxCustomers: 999999,
        timezone: "UTC",
        defaultLocale: "en",
      },
    });
  }

  // Ensure all plans are active (restore any retired plans)
  await prisma.planVersion.updateMany({
    where: {
      tenantId: "tenant_platform",
      retiredDate: { not: null },
    },
    data: {
      retiredDate: null,
    },
  });

  // Check if plans exist
  const existingPlans = await prisma.planVersion.count({
    where: { tenantId: "tenant_platform" },
  });

  if (existingPlans >= 3) {
    return; // Plans already exist and are now active
  }

  // Create plans
  const plans = [
    {
      planSlug: "FREE",
      version: 1,
      pricing: {
        amount: 0,
        currency: "USD",
        interval: "MONTHLY",
        name: "Free Plan",
      },
      features: {
        maxCustomers: 10,
        whiteLabeling: false,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: true,
        emailSupport: true,
      },
    },
    {
      planSlug: "STARTER",
      version: 1,
      pricing: {
        amount: 49,
        currency: "USD",
        interval: "MONTHLY",
        name: "Starter Plan",
      },
      features: {
        maxCustomers: 100,
        whiteLabeling: false,
        prioritySupport: true,
        advancedAnalytics: false,
        apiAccess: true,
        phoneSupport: true,
      },
    },
    {
      planSlug: "PRO",
      version: 1,
      pricing: {
        amount: 199,
        currency: "USD",
        interval: "MONTHLY",
        name: "Pro Plan",
      },
      features: {
        maxCustomers: 1000,
        whiteLabeling: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
        dedicatedSupport: true,
      },
    },
  ];

  for (const plan of plans) {
    await prisma.planVersion.create({
      data: {
        tenantId: "tenant_platform",
        planSlug: plan.planSlug,
        version: plan.version,
        pricing: plan.pricing,
        features: plan.features,
        effectiveDate: new Date(),
        retiredDate: null,
        migrationStrategy: "GRANDFATHER",
        createdBy: "system",
      },
    });
  }
}

/**
 * Create test tenant with admin user
 */
export async function createTestTenant(data: {
  name: string;
  slug: string;
  email: string;
  password?: string;
}) {
  const hashedPassword = await hashPassword(data.password || "Test@123456");

  const tenant = await prisma.tenant.create({
    data: {
      name: data.name,
      slug: data.slug,
      status: "ACTIVE",
      plan: "FREE",
      maxCustomers: 10,
      timezone: "UTC",
      defaultLocale: "en",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: "Test Admin",
      locale: "en",
      memberships: {
        create: {
          tenantId: tenant.id,
          role: "TENANT_ADMIN",
          isActive: true,
        },
      },
    },
    include: {
      memberships: {
        include: { tenant: true },
      },
    },
  });

  return { tenant, user };
}

/**
 * Create Super Admin user
 */
export async function createSuperAdmin() {
  const hashedPassword = await hashPassword(
    process.env.SUPER_ADMIN_PASSWORD || "Admin@123456",
  );

  return prisma.user.create({
    data: {
      email: "admin@tirdad.com",
      password: hashedPassword,
      name: "Super Admin",
      locale: "en",
      memberships: {
        create: {
          tenantId: "tenant_platform",
          role: "SUPER_ADMIN",
          isActive: true,
        },
      },
    },
    include: {
      memberships: {
        include: { tenant: true },
      },
    },
  });
}

/**
 * Setup test database (run before tests)
 */
export async function setupTestDb() {
  await seedPlatform();
}

/**
 * Teardown test database (run after tests)
 */
export async function teardownTestDb() {
  await clearDatabase();
  await prisma.$disconnect();
}
