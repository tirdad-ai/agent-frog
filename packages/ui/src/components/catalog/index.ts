/**
 * Catalog Components
 *
 * Reusable UI components for managing bilingual product/pricing catalogs
 * that generate Kill Bill-compatible XML.
 *
 * These components work for both admin and portal applications.
 */

// Components
export { ProductList } from "./product-list";
export { CatalogPreview } from "./catalog-preview";

// Types from components
export type { Product } from "./product-list";
export type {
  CatalogSummary,
  CatalogVersion,
  PublishResult,
} from "./catalog-preview";

// Hooks
export {
  useCatalogProducts,
  useCatalogPreview,
  useCatalogVersions,
  useCatalog,
} from "../../hooks/use-catalog";

// Types from hooks
export type {
  CreateProductRequest,
  CreatePricingRefRequest,
  CatalogPreviewData,
  PublishCatalogOptions,
  CatalogHooksConfig,
} from "../../hooks/use-catalog";

/**
 * Usage Examples:
 *
 * // Basic product management
 * import { ProductList, ProductForm, useCatalogProducts } from '@repo/ui/catalog';
 *
 * function ProductManagement() {
 *   const { products, isLoading, createProduct, deleteProduct } = useCatalogProducts();
 *
 *   return (
 *     <ProductList
 *       products={products}
 *       isLoading={isLoading}
 *       onCreateProduct={() => setShowForm(true)}
 *       onDeleteProduct={deleteProduct}
 *     />
 *   );
 * }
 *
 * // Catalog preview and publishing
 * import { CatalogPreview, useCatalogPreview } from '@repo/ui/catalog';
 *
 * function CatalogPublishing() {
 *   const { previewData, generatePreview, publishCatalog } = useCatalogPreview();
 *
 *   useEffect(() => {
 *     generatePreview();
 *   }, []);
 *
 *   return (
 *     <CatalogPreview
 *       xmlContent={previewData?.xml || ''}
 *       summary={previewData?.summary || {}}
 *       onPublish={publishCatalog}
 *     />
 *   );
 * }
 *
 * // Multi-tenant configuration
 * import { useCatalog } from '@repo/ui/catalog';
 *
 * function TenantCatalog({ tenantId }: { tenantId: string }) {
 *   const { products, preview } = useCatalog({
 *     tenantId,
 *     apiBaseUrl: '/api/tenant/catalog',
 *     headers: { 'Authorization': 'Bearer token' }
 *   });
 *
 *   // ... use products and preview
 * }
 */
