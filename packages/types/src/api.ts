/**
 * API Response Types
 *
 * Generic wrappers for all API responses
 */

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: ApiMeta;
}

export interface ApiMeta {
  timestamp?: string;
  requestId?: string;
  // Pagination
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================================================
// List Query Types
// ============================================================================

export interface ListServicesParams extends PaginationParams {
  status?: "ACTIVE" | "ARCHIVED";
  search?: string;
}

export interface ListFeaturesParams extends PaginationParams {
  type?: "BOOLEAN" | "NUMERIC" | "TEXT";
  search?: string;
}

export interface ListPlansParams extends PaginationParams {
  serviceId?: string;
  status?: "ACTIVE" | "RETIRED";
  search?: string;
}
