import { auth } from "@/lib/auth";
import { SuperAdminBanner } from "@/components/dashboard/super-admin-banner";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("common");
  const session = await auth();

  // Show banner if Super Admin is viewing a non-platform tenant
  const isSuperAdmin = session?.membership?.role === "SUPER_ADMIN";
  const isPlatformTenant = session?.currentTenant?.id === "tenant_platform";
  const showBanner = isSuperAdmin && !isPlatformTenant;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {showBanner && (
        <SuperAdminBanner
          userEmail={session?.user?.email || ""}
          tenantName={session?.currentTenant?.name || ""}
        />
      )}

      <div className="rounded-lg border bg-card p-8 text-center">
        <h1 className="text-4xl font-bold">{t("dashboard")}</h1>
        <p className="text-muted-foreground mt-2">{t("welcome")}</p>
      </div>
    </div>
  );
}
