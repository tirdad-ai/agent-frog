"use client";

import { SidebarTrigger, Separator, TenantSwitcher } from "@repo/ui";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../language-switcher";
import { UserMenu } from "./user-menu";
import { useTenantSwitch } from "@/hooks/use-tenant-switch";
import { useMemberships } from "@/hooks/use-memberships";

interface DashboardHeaderProps {
  session: any;
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  const t = useTranslations("common.tenant_switcher");
  const { switchTenant, isLoading: isSwitching } = useTenantSwitch();
  const { data: membershipsData, isLoading: isLoadingMemberships } =
    useMemberships();

  // Get memberships from API
  const memberships = membershipsData?.data || [];

  // Find current tenant from active membership
  const currentMembership = memberships.find((m: any) => m.isActive);
  const currentTenantId = currentMembership?.tenantId || "";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Tenant Switcher */}
          <TenantSwitcher
            currentTenantId={currentTenantId}
            memberships={memberships}
            onSwitch={switchTenant}
            isLoading={isSwitching || isLoadingMemberships}
            translations={{
              switchTenant: t("switch"),
              search: t("search"),
              current: t("current"),
              showing: t.raw("showing") as string,
              loading: t("loading"),
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Separator orientation="vertical" className="h-6" />
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  );
}
