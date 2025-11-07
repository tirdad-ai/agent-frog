"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/base/card";
import { Badge } from "@repo/ui/components/base/badge";

interface TenantSelectorProps {
  // i18n translation functions
  t?: {
    select_organization?: string;
    no_organizations?: string;
  };
  // Link component for navigation (supports i18n routing)
  LinkComponent?: React.ComponentType<any>;
}

export function TenantSelector({
  t = {},
  LinkComponent = "a" as any,
}: TenantSelectorProps) {
  const { data: session, update } = useSession();
  const router = useRouter();

  const handleTenantSelect = async (tenantId: string) => {
    await update({ tenantId });
    router.push("/dashboard");
    router.refresh();
  };

  const sessionWithTenants = session as typeof session & { tenants?: any[] };

  if (!sessionWithTenants?.tenants?.length) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t.no_organizations || "No Organizations"}</CardTitle>
          <CardDescription>
            You don&apos;t have access to any organizations yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Contact your administrator to get access to an organization.
          </p>
          <Button
            onClick={() => router.push("/auth/login")}
            variant="outline"
            className="w-full"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {t.select_organization || "Select Organization"}
        </h1>
        <p className="text-muted-foreground">
          Choose an organization to continue
        </p>
      </div>

      <div className="grid gap-4">
        {sessionWithTenants.tenants?.map((tenant) => (
          <Card
            key={tenant.id}
            className="cursor-pointer transition-colors hover:border-primary"
            onClick={() => handleTenantSelect(tenant.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{tenant.name}</CardTitle>
                  <CardDescription>/{tenant.slug}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      tenant.status === "ACTIVE" ? "default" : "destructive"
                    }
                  >
                    {tenant.status}
                  </Badge>
                  <Badge variant="outline">{tenant.role}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
