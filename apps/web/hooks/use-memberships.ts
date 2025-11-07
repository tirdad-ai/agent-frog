"use client";

import { useQuery } from "@tanstack/react-query";

interface Membership {
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

interface MembershipsResponse {
  success: boolean;
  data: Membership[];
  total: number;
  hasMore: boolean;
}

export function useMemberships() {
  return useQuery<MembershipsResponse>({
    queryKey: ["memberships"],
    queryFn: async () => {
      const response = await fetch("/api/v1/memberships/me");
      if (!response.ok) {
        throw new Error("Failed to fetch memberships");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
