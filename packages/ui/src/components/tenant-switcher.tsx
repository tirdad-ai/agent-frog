"use client";

import * as React from "react";
import {
  Building,
  Landmark,
  ChevronsUpDown,
  Check,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./base/dropdown-menu";
import { Button } from "./base/button";
import { Input } from "./base/input";
import { Badge } from "./base/badge";
import { cn } from "../lib/utils";

export interface TenantMembership {
  id: string;
  tenantId: string;
  role: "SUPER_ADMIN" | "TENANT_ADMIN" | "USER";
  isActive: boolean;
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan?: string;
  };
}

export interface TenantSwitcherProps {
  currentTenantId: string;
  memberships: TenantMembership[];
  onSwitch: (tenantId: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
  translations?: {
    switchTenant: string;
    search: string;
    current: string;
    showing: string;
    loading: string;
  };
}

export function TenantSwitcher({
  currentTenantId,
  memberships,
  onSwitch,
  isLoading = false,
  className,
  translations = {
    switchTenant: "Switch Tenant Context",
    search: "Search tenants...",
    current: "Current",
    showing: "Showing {shown} of {total} tenants",
    loading: "Switching...",
  },
}: TenantSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Get current tenant
  const currentMembership = memberships.find(
    (m) => m.tenantId === currentTenantId,
  );

  // Separate platform tenant from others
  const platformMembership = memberships.find(
    (m) => m.tenantId === "tenant_platform",
  );
  const regularMemberships = memberships.filter(
    (m) => m.tenantId !== "tenant_platform",
  );

  // Filter memberships by search query
  const filteredMemberships = searchQuery
    ? regularMemberships.filter((m) =>
        m.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : regularMemberships;

  const handleSwitch = async (tenantId: string) => {
    if (tenantId === currentTenantId) {
      setOpen(false);
      return;
    }

    try {
      await onSwitch(tenantId);
      setOpen(false);
    } catch (error) {
      console.error("Failed to switch tenant:", error);
      // Keep dropdown open on error
    }
  };

  // If user has only one membership, show static text
  if (memberships.length <= 1) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Building className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          {currentMembership?.tenant.name || "Loading..."}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="truncate">{translations.loading}</span>
            </>
          ) : (
            <>
              <Building className="mr-2 h-4 w-4" />
              <span className="truncate">
                {currentMembership?.tenant.name || "Select tenant"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[300px] p-0" align="start">
        <DropdownMenuLabel className="px-2 py-2">
          {translations.switchTenant}
        </DropdownMenuLabel>

        <div className="px-2 pb-2">
          <Input
            placeholder={translations.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup
          value={currentTenantId}
          onValueChange={handleSwitch}
        >
          {/* Platform Tenant (if exists) - Always first */}
          {platformMembership && (
            <>
              <DropdownMenuRadioItem
                value={platformMembership.tenantId}
                className="flex items-center gap-2 px-2 py-2"
              >
                <Landmark className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      {platformMembership.tenant.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {platformMembership.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      Platform
                    </Badge>
                    {platformMembership.tenantId === currentTenantId && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Regular Tenants */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredMemberships.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No tenants found
              </div>
            ) : (
              filteredMemberships.map((membership) => (
                <DropdownMenuRadioItem
                  key={membership.tenantId}
                  value={membership.tenantId}
                  className="flex items-center gap-2 px-2 py-2"
                >
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        {membership.tenant.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {membership.role}
                      </span>
                    </div>
                    {membership.tenantId === currentTenantId && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                </DropdownMenuRadioItem>
              ))
            )}
          </div>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <div className="px-2 py-2 text-xs text-muted-foreground">
          {translations.showing
            .replace("{shown}", String(filteredMemberships.length))
            .replace("{total}", String(memberships.length))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
