"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Feature,
  Plan,
  CreateFeatureRequest,
  UpdateFeatureRequest,
  CreatePlanRequest,
  UpdatePlanRequest,
  ApiResponse,
  ListFeaturesParams,
  ListPlansParams,
} from "@repo/types";

// ============================================================================
// API Client Helper
// ============================================================================

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`/api/v1/catalog${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include", // Important: include cookies for authentication
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      error: { code: "UNKNOWN_ERROR", message: "An error occurred" },
    }));
    throw new Error(error.error?.message || "Request failed");
  }

  return res.json();
}

// ============================================================================
// Features Queries
// ============================================================================

export function useFeatures(params?: ListFeaturesParams) {
  const queryString = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  const endpoint = `/features${queryString ? `?${queryString}` : ""}`;

  return useQuery<ApiResponse<Feature[]>>({
    queryKey: ["features", params],
    queryFn: () => apiFetch(endpoint),
  });
}

export function useFeature(id: string | null) {
  return useQuery<ApiResponse<Feature>>({
    queryKey: ["features", id],
    queryFn: () => apiFetch(`/features/${id}`),
    enabled: !!id,
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Feature>, Error, CreateFeatureRequest>({
    mutationFn: (data) =>
      apiFetch("/features", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Feature>,
    Error,
    { id: string; data: UpdateFeatureRequest }
  >({
    mutationFn: ({ id, data }) =>
      apiFetch(`/features/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      queryClient.invalidateQueries({ queryKey: ["features", id] });
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Feature>, Error, string>({
    mutationFn: (id) =>
      apiFetch(`/features/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });
}

// ============================================================================
// Plans Queries
// ============================================================================

export function usePlans(params?: ListPlansParams) {
  const queryString = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  const endpoint = `/plans${queryString ? `?${queryString}` : ""}`;

  return useQuery<ApiResponse<Plan[]>>({
    queryKey: ["plans", params],
    queryFn: () => apiFetch(endpoint),
  });
}

export function usePlansWithFeatures(params?: ListPlansParams) {
  const queryParams = {
    ...Object.fromEntries(
      Object.entries(params || {}).map(([k, v]) => [k, String(v)]),
    ),
    includeFeatures: "true",
  };
  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = `/plans${queryString ? `?${queryString}` : ""}`;

  return useQuery<ApiResponse<Plan[]>>({
    queryKey: ["plans", "with-features", params],
    queryFn: () => apiFetch(endpoint),
  });
}

export function usePlan(id: string | null) {
  return useQuery<ApiResponse<Plan>>({
    queryKey: ["plans", id, "full"],
    queryFn: () =>
      apiFetch(`/plans/${id}?includeFeatures=true&includePricing=true`),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Plan>, Error, CreatePlanRequest>({
    mutationFn: (data) =>
      apiFetch("/plans", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useUpdatePlan(id: string) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Plan>, Error, UpdatePlanRequest>({
    mutationFn: (data) =>
      apiFetch(`/plans/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans", id] });
    },
  });
}

export function useRetirePlan(id: string) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Plan>, Error, { effectiveDate: string }>({
    mutationFn: (data) =>
      apiFetch(`/plans/${id}/retire`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans", id] });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: (id) =>
      apiFetch(`/plans/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

// ============================================================================
// Pricing Queries
// ============================================================================

export function useAddPricingToPlan(planId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<any>,
    Error,
    {
      model: string;
      billingPeriod: string;
      amount: number;
      currency: string;
      trialDays: number;
      setupFee?: number;
    }
  >({
    mutationFn: (data) =>
      apiFetch(`/plans/${planId}/pricing`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans", planId] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

// ============================================================================
// Catalog Sync
// ============================================================================

export function useSyncCatalog() {
  return useMutation<
    ApiResponse<{
      syncId: string;
      success: boolean;
      xml?: string;
      error?: string;
    }>,
    Error,
    void
  >({
    mutationFn: () =>
      apiFetch("/sync", {
        method: "POST",
      }),
  });
}
