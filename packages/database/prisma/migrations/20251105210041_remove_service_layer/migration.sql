/*
  Warnings:

  - The values [SERVICE_CREATED,SERVICE_UPDATED,SERVICE_ARCHIVED] on the enum `AuditAction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `catalogVersion` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `killBillPlanId` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `killBillPhaseId` on the `pricing` table. All the data in the column will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tenantId,planKey,version]` on the table `plans` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditAction_new" AS ENUM ('USER_LOGIN', 'USER_LOGOUT', 'USER_SIGNUP', 'PASSWORD_RESET', 'TENANT_CREATED', 'TENANT_UPDATED', 'TENANT_SUSPENDED', 'TENANT_CANCELLED', 'TENANT_SWITCH', 'ADMIN_TENANT_SWITCH', 'ADMIN_LIMIT_OVERRIDE', 'ADMIN_PLATFORM_UPDATE', 'FEATURE_CREATED', 'FEATURE_UPDATED', 'FEATURE_DELETED', 'PLAN_CREATED', 'PLAN_UPDATED', 'PLAN_VERSIONED', 'PLAN_RETIRED', 'PRICING_ADDED', 'PRICING_UPDATED', 'CATALOG_SYNCED');
ALTER TABLE "audit_logs" ALTER COLUMN "action" TYPE "AuditAction_new" USING ("action"::text::"AuditAction_new");
ALTER TYPE "AuditAction" RENAME TO "AuditAction_old";
ALTER TYPE "AuditAction_new" RENAME TO "AuditAction";
DROP TYPE "AuditAction_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "plans" DROP CONSTRAINT "plans_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_tenantId_fkey";

-- DropIndex
DROP INDEX "plans_tenantId_serviceId_idx";

-- DropIndex
DROP INDEX "plans_tenantId_serviceId_nameEn_version_key";

-- DropIndex
DROP INDEX "plans_tenantId_serviceId_planKey_key";

-- DropIndex
DROP INDEX "plans_version_idx";

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "catalogVersion",
DROP COLUMN "killBillPlanId",
DROP COLUMN "serviceId",
ADD COLUMN     "killBillProductId" VARCHAR(255);

-- AlterTable
ALTER TABLE "pricing" DROP COLUMN "killBillPhaseId",
ADD COLUMN     "killBillPlanId" VARCHAR(255);

-- DropTable
DROP TABLE "services";

-- DropEnum
DROP TYPE "ServiceStatus";

-- CreateIndex
CREATE INDEX "plans_tenantId_idx" ON "plans"("tenantId");

-- CreateIndex
CREATE INDEX "plans_planKey_idx" ON "plans"("planKey");

-- CreateIndex
CREATE INDEX "plans_killBillProductId_idx" ON "plans"("killBillProductId");

-- CreateIndex
CREATE UNIQUE INDEX "plans_tenantId_planKey_version_key" ON "plans"("tenantId", "planKey", "version");

-- CreateIndex
CREATE INDEX "pricing_killBillPlanId_idx" ON "pricing"("killBillPlanId");
