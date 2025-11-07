"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@repo/ui";
import { useTranslations } from "next-intl";

interface SuperAdminBannerProps {
  userEmail: string;
  tenantName: string;
}

export function SuperAdminBanner({
  userEmail,
  tenantName,
}: SuperAdminBannerProps) {
  const t = useTranslations("common.tenant_switcher");

  return (
    <Alert
      variant="default"
      className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
    >
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
        {t("admin_warning", { email: userEmail })}
      </AlertDescription>
    </Alert>
  );
}
