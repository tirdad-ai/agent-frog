"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui";
import { useTranslations } from "next-intl";

interface SwitchTenantResponse {
  success: boolean;
  message: string;
  data?: {
    tenantId: string;
    role: string;
  };
}

export function useTenantSwitch() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("common.tenant_switcher");

  const switchTenant = async (tenantId: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/tenant/switch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenantId }),
      });

      const data: SwitchTenantResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("error"));
      }

      // Success - reload page to refresh session
      router.refresh();

      toast({
        title: t("success_title"),
        description: t("success_description"),
      });
    } catch (error) {
      console.error("Failed to switch tenant:", error);

      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("error_description"),
      });

      throw error; // Re-throw so TenantSwitcher can handle it
    } finally {
      setIsLoading(false);
    }
  };

  return {
    switchTenant,
    isLoading,
  };
}
