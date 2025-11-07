"use client";

import { useState, useCallback, useEffect } from "react";

// Types matching the catalog service
export interface CreateProductRequest {
  key: string;
  category: "BASE" | "ADD_ON" | "STANDALONE";
  translations: Array<{
    locale: "en" | "ar";
    name: string;
    description?: string;
  }>;
  includes?: string[];
  allows?: string[];
}

export interface CreatePricingRefRequest {
  key: string;
  billingPeriod: "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUAL";
  recurring?: Record<string, number>;
  fixed?: Record<string, number>;
  usageTiers?: Array<{
    index: number;
    usageBlocks: Array<{
      unitKey: string;
      size: number;
      max?: number;
      prices: Record<string, number>;
    }>;
  }>;
}

export interface Product {
  id: string;
  key: string;
  category: "BASE" | "ADD_ON" | "STANDALONE";
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
  versions: Array<{
    id: string;
    version: number;
    isActive: boolean;
    effectiveDate: Date;
    translations: Array<{
      locale: "en" | "ar";
      name: string;
      description?: string;
    }>;
    planVariants: Array<{
      id: string;
      key: string;
      planNameOverride?: string;
    }>;
    includes: Array<{
      addonProductKey: string;
      inclusionType: "includes" | "allows";
    }>;
  }>;
}

export interface CatalogPreviewData {
  catalog: any;
  xml: string;
  summary: {
    productCount: number;
    baseProducts: number;
    addonProducts: number;
    standaloneProducts: number;
    planCount: number;
    currencies: string[];
    priceListCount: number;
    effectiveDate: string;
    xmlSize?: number;
  };
}

export interface PublishCatalogOptions {
  versionTag: string;
  effectiveDate?: Date;
  notes?: string;
  validateXSD?: boolean;
}

export interface PublishResult {
  catalogVersion: {
    id: string;
    versionTag: string;
    effectiveDate: Date;
    notes?: string;
    publishedBy?: string;
    createdAt: Date;
  };
  validationResult: {
    valid: boolean;
    messages?: string[];
  };
  summary: CatalogPreviewData["summary"];
}

// Configuration for the catalog hooks
export interface CatalogHooksConfig {
  /** Base URL for catalog API endpoints */
  apiBaseUrl?: string;
  /** Tenant ID for multi-tenant environments */
  tenantId?: string;
  /** Custom fetch function for API calls */
  fetchFn?: typeof fetch;
  /** Custom headers to include with requests */
  headers?: Record<string, string>;
}

/**
 * Hook for managing catalog products
 */
export function useCatalogProducts(config: CatalogHooksConfig = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = config.apiBaseUrl || "/api/admin/catalog";
  const fetchFn = config.fetchFn || fetch;
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(config.tenantId ? { "X-Tenant-ID": config.tenantId } : {}),
    ...config.headers,
  };

  const fetchProducts = useCallback(
    async (
      options: {
        category?: string;
        locale?: "en" | "ar";
        includeInactive?: boolean;
      } = {},
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (options.category) params.set("category", options.category);
        if (options.locale) params.set("locale", options.locale);
        if (options.includeInactive) params.set("includeInactive", "true");

        const url = `${apiBaseUrl}/admin/products${params.toString() ? "?" + params.toString() : ""}`;
        const response = await fetchFn(url, {
          headers: defaultHeaders,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(
          data.map((product: any) => ({
            ...product,
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt),
            versions: product.versions.map((version: any) => ({
              ...version,
              effectiveDate: new Date(version.effectiveDate),
            })),
          })),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, fetchFn, defaultHeaders],
  );

  const createProduct = useCallback(
    async (data: CreateProductRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchFn(`${apiBaseUrl}/products`, {
          method: "POST",
          headers: defaultHeaders,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Failed to create product: ${response.statusText}`,
          );
        }

        const result = await response.json();

        // Refresh products list
        await fetchProducts();

        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to create product";
        setError(error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, fetchFn, defaultHeaders, fetchProducts],
  );

  const updateProduct = useCallback(
    async (productId: string, data: Partial<CreateProductRequest>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchFn(`${apiBaseUrl}/products/${productId}`, {
          method: "PUT",
          headers: defaultHeaders,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Failed to update product: ${response.statusText}`,
          );
        }

        const result = await response.json();

        // Refresh products list
        await fetchProducts();

        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to update product";
        setError(error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, fetchFn, defaultHeaders, fetchProducts],
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchFn(`${apiBaseUrl}/products/${productId}`, {
          method: "DELETE",
          headers: defaultHeaders,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Failed to delete product: ${response.statusText}`,
          );
        }

        // Refresh products list
        await fetchProducts();
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to delete product";
        setError(error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, fetchFn, defaultHeaders, fetchProducts],
  );

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError: () => setError(null),
  };
}

/**
 * Hook for catalog preview and publishing
 */
export function useCatalogPreview(config: CatalogHooksConfig = {}) {
  const [previewData, setPreviewData] = useState<CatalogPreviewData | null>(
    null,
  );
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = config.apiBaseUrl || "/api/catalog";
  const fetchFn = config.fetchFn || fetch;
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(config.tenantId ? { "X-Tenant-ID": config.tenantId } : {}),
    ...config.headers,
  };

  const generatePreview = useCallback(async () => {
    setIsLoadingPreview(true);
    setError(null);

    try {
      const response = await fetchFn(`${apiBaseUrl}/preview`, {
        headers: defaultHeaders,
      });

      if (!response.ok) {
        throw new Error(`Failed to generate preview: ${response.statusText}`);
      }

      const data = await response.json();
      setPreviewData({
        ...data,
        summary: {
          ...data.summary,
          xmlSize: new TextEncoder().encode(data.xml).length,
        },
      });

      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate preview",
      );
      throw err;
    } finally {
      setIsLoadingPreview(false);
    }
  }, [apiBaseUrl, fetchFn, defaultHeaders]);

  const publishCatalog = useCallback(
    async (options: PublishCatalogOptions): Promise<PublishResult> => {
      setIsPublishing(true);
      setError(null);

      try {
        const response = await fetchFn(`${apiBaseUrl}/publish`, {
          method: "POST",
          headers: defaultHeaders,
          body: JSON.stringify(options),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Failed to publish catalog: ${response.statusText}`,
          );
        }

        const result = await response.json();

        return {
          catalogVersion: {
            ...result.catalogVersion,
            effectiveDate: new Date(result.catalogVersion.effectiveDate),
            createdAt: new Date(result.catalogVersion.createdAt),
          },
          validationResult: result.validationResult,
          summary: result.summary,
        };
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to publish catalog";
        setError(error);
        throw err;
      } finally {
        setIsPublishing(false);
      }
    },
    [apiBaseUrl, fetchFn, defaultHeaders],
  );

  const downloadXml = useCallback(
    async (versionId?: string) => {
      try {
        const url = versionId
          ? `${apiBaseUrl}/versions/${versionId}/download`
          : `${apiBaseUrl}/preview/download`;

        const response = await fetchFn(url, {
          headers: defaultHeaders,
        });

        if (!response.ok) {
          throw new Error(`Failed to download XML: ${response.statusText}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;

        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get("Content-Disposition");
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") ||
            `catalog-${versionId || "preview"}.xml`
          : `catalog-${versionId || "preview"}.xml`;

        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to download XML";
        setError(error);
        throw err;
      }
    },
    [apiBaseUrl, fetchFn, defaultHeaders],
  );

  return {
    previewData,
    isLoadingPreview,
    isPublishing,
    error,
    generatePreview,
    publishCatalog,
    downloadXml,
    clearError: () => setError(null),
  };
}

/**
 * Hook for managing catalog versions history
 */
export function useCatalogVersions(config: CatalogHooksConfig = {}) {
  const [versions, setVersions] = useState<PublishResult["catalogVersion"][]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  const apiBaseUrl = config.apiBaseUrl || "/api/catalog";
  const fetchFn = config.fetchFn || fetch;
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(config.tenantId ? { "X-Tenant-ID": config.tenantId } : {}),
    ...config.headers,
  };

  const fetchVersions = useCallback(
    async (options: { limit?: number; offset?: number } = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (options.limit) params.set("limit", options.limit.toString());
        if (options.offset) params.set("offset", options.offset.toString());

        const response = await fetchFn(
          `${apiBaseUrl}/versions?${params.toString()}`,
          {
            headers: defaultHeaders,
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch versions: ${response.statusText}`);
        }

        const data = await response.json();
        setVersions(
          data.versions.map((version: any) => ({
            ...version,
            effectiveDate: new Date(version.effectiveDate),
            createdAt: new Date(version.createdAt),
          })),
        );
        setPagination(data.pagination);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch versions",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, fetchFn, defaultHeaders],
  );

  return {
    versions,
    pagination,
    isLoading,
    error,
    fetchVersions,
    clearError: () => setError(null),
  };
}

/**
 * Combined hook that provides all catalog functionality
 */
export function useCatalog(config: CatalogHooksConfig = {}) {
  const products = useCatalogProducts(config);
  const preview = useCatalogPreview(config);
  const versions = useCatalogVersions(config);

  return {
    products,
    preview,
    versions,
  };
}
