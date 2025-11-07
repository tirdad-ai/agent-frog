"use client";

import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  Settings,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";

interface AppSidebarProps {
  session: any;
}

const navigationItems = [
  {
    title: "Dashboard",
    i18nKey: "dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Catalog",
    i18nKey: "catalog",
    icon: Package,
    href: "/dashboard/catalog",
  },
  {
    title: "Subscriptions",
    i18nKey: "subscriptions",
    icon: CreditCard,
    href: "/dashboard/subscriptions",
  },
  {
    title: "Customers",
    i18nKey: "customers",
    icon: Users,
    href: "/dashboard/customers",
  },
  {
    title: "Settings",
    i18nKey: "settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
  {
    title: "Support",
    i18nKey: "support",
    icon: LifeBuoy,
    href: "/dashboard/support",
  },
];

export function AppSidebar({ session }: AppSidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");

  const currentTenant = session?.currentTenant;
  const plan = currentTenant?.plan || "FREE";

  // Determine sidebar side based on locale (RTL = right, LTR = left)
  const sidebarSide = locale === "ar" ? "right" : "left";

  return (
    <Sidebar collapsible="icon" side={sidebarSide}>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">T</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Tirdad</span>
            <span className="text-xs text-muted-foreground">
              {currentTenant?.name || "Loading..."}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{tNav(item.i18nKey)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium">
            {plan} {tCommon("plan")}
          </span>
          <span className="text-xs text-muted-foreground">
            0 / {currentTenant?.maxCustomers || 10} {tCommon("customers")}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
