/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,serviceId,planKey]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `planKey` to the `plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add planKey column with temporary default
ALTER TABLE "plans" ADD COLUMN "planKey" TEXT;

-- Populate planKey from nameEn for existing plans (generate slug)
UPDATE "plans"
SET "planKey" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(TRIM("nameEn"), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-+|-+$)', '', 'g'
  )
)
WHERE "planKey" IS NULL;

-- Make planKey required
ALTER TABLE "plans" ALTER COLUMN "planKey" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "plans_tenantId_serviceId_planKey_key" ON "plans"("tenantId", "serviceId", "planKey");
