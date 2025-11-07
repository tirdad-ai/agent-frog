import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Platform Tenant
  console.log("Creating platform tenant...");
  const platformTenant = await prisma.tenant.upsert({
    where: { id: "tenant_platform" },
    update: {},
    create: {
      id: "tenant_platform",
      name: "Tirdad Platform",
      slug: "tirdad-platform",
      status: "ACTIVE",
      plan: "FREE", // Platform tenant uses FREE plan
      maxCustomers: 999999, // Unlimited for platform
      timezone: "UTC",
      defaultLocale: "en",
    },
  });
  console.log("✅ Platform tenant created:", platformTenant.id);

  // 2. Create Super Admin User
  console.log("Creating Super Admin user...");
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@123456";
  const hashedPassword = await hashPassword(superAdminPassword);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@tirdad.com" },
    update: {},
    create: {
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
  });
  console.log("✅ Super Admin created:", superAdmin.email);

  // 3. Create Plan Versions (FREE, STARTER, PRO)
  console.log("Creating plan versions...");

  const freePlan = await prisma.planVersion.upsert({
    where: {
      tenantId_planSlug_version: {
        tenantId: "tenant_platform",
        planSlug: "FREE",
        version: 1,
      },
    },
    update: {},
    create: {
      tenantId: "tenant_platform",
      planSlug: "FREE",
      version: 1,
      pricing: {
        amount: 0,
        currency: "USD",
        interval: "month",
      },
      features: {
        maxCustomers: 10,
        emailSupport: true,
        prioritySupport: false,
        phoneSupport: false,
        whiteLabeling: false,
        advancedAnalytics: false,
      },
      createdBy: "admin@tirdad.com",
    },
  });
  console.log("✅ FREE plan created");

  const starterPlan = await prisma.planVersion.upsert({
    where: {
      tenantId_planSlug_version: {
        tenantId: "tenant_platform",
        planSlug: "STARTER",
        version: 1,
      },
    },
    update: {},
    create: {
      tenantId: "tenant_platform",
      planSlug: "STARTER",
      version: 1,
      pricing: {
        amount: 49,
        currency: "USD",
        interval: "month",
      },
      features: {
        maxCustomers: 100,
        emailSupport: true,
        prioritySupport: true,
        phoneSupport: true,
        whiteLabeling: false,
        advancedAnalytics: false,
      },
      createdBy: "admin@tirdad.com",
    },
  });
  console.log("✅ STARTER plan created");

  const proPlan = await prisma.planVersion.upsert({
    where: {
      tenantId_planSlug_version: {
        tenantId: "tenant_platform",
        planSlug: "PRO",
        version: 1,
      },
    },
    update: {},
    create: {
      tenantId: "tenant_platform",
      planSlug: "PRO",
      version: 1,
      pricing: {
        amount: 199,
        currency: "USD",
        interval: "month",
      },
      features: {
        maxCustomers: 1000,
        emailSupport: true,
        prioritySupport: true,
        phoneSupport: true,
        whiteLabeling: true,
        advancedAnalytics: true,
      },
      createdBy: "admin@tirdad.com",
    },
  });
  console.log("✅ PRO plan created");

  // 4. Create initial audit log (using ADMIN_PLATFORM_UPDATE as proxy for system seed)
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      tenantId: "tenant_platform",
      action: "ADMIN_PLATFORM_UPDATE",
      resource: "Database",
      metadata: {
        message: "Initial database seed completed",
        plans: ["FREE", "STARTER", "PRO"],
      },
      ipAddress: "127.0.0.1",
      userAgent: "Prisma Seed Script",
    },
  });
  console.log("✅ Audit log created");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
