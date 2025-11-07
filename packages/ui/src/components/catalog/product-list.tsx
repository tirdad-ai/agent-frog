"use client";

import React, { useState, useMemo } from "react";
import { Button } from "../base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../base/card";
import { Input } from "../base/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../base/select";
import { Badge } from "../base/badge";
import { Separator } from "../base/separator";
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Eye,
  Languages,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../base/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../base/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../base/alert-dialog";

export interface Product {
  id: string;
  key: string;
  category: "BASE" | "ADD_ON" | "STANDALONE";
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
  versions?: Array<{
    id: string;
    version: number;
    isActive: boolean;
    effectiveDate: Date;
    translations?: Array<{
      locale: "en" | "ar";
      name: string;
      description?: string;
    }>;
    planVariants?: Array<{
      id: string;
      key: string;
      planNameOverride?: string;
    }>;
    includes?: Array<{
      addonProductKey: string;
      inclusionType: "includes" | "allows";
    }>;
  }>;
}

interface ProductListProps {
  /** List of products */
  products: Product[];
  /** Loading state */
  isLoading?: boolean;
  /** Selected locale for displaying translations */
  locale?: "en" | "ar";
  /** Callback when creating a new product */
  onCreateProduct?: () => void;
  /** Callback when editing a product */
  onEditProduct?: (product: Product) => void;
  /** Callback when viewing a product */
  onViewProduct?: (product: Product) => void;
  /** Callback when cloning a product */
  onCloneProduct?: (product: Product) => void;
  /** Callback when deleting a product */
  onDeleteProduct?: (product: Product) => Promise<void>;
  /** Current user permissions */
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canView?: boolean;
  };
}

export function ProductList({
  products,
  isLoading = false,
  locale = "en",
  onCreateProduct,
  onEditProduct,
  onViewProduct,
  onCloneProduct,
  onDeleteProduct,
  permissions = {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
  },
}: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<"en" | "ar" | "all">(
    "all",
  );
  const [sortBy, setSortBy] = useState<
    "name" | "category" | "created" | "updated"
  >("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get the translation for a product in the current locale
  const getProductTranslation = (
    product: Product,
    targetLocale: "en" | "ar",
  ) => {
    if (!product.versions || product.versions.length === 0) return null;

    const activeVersion = product.versions[0];
    if (!activeVersion || !activeVersion.translations) return null;

    return (
      activeVersion.translations.find((t) => t.locale === targetLocale) ||
      activeVersion.translations.find((t) => t.locale === "en") ||
      activeVersion.translations[0] ||
      null
    );
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const enTranslation = getProductTranslation(product, "en");
        const arTranslation = getProductTranslation(product, "ar");

        return (
          product.key.toLowerCase().includes(query) ||
          enTranslation?.name.toLowerCase().includes(query) ||
          enTranslation?.description?.toLowerCase().includes(query) ||
          arTranslation?.name.toLowerCase().includes(query) ||
          arTranslation?.description?.toLowerCase().includes(query)
        );
      });
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter,
      );
    }

    // Language filter (products that have translations in the selected language)
    if (languageFilter !== "all") {
      filtered = filtered.filter((product) => {
        const activeVersion = product.versions?.[0];
        return (
          activeVersion?.translations?.some(
            (t) => t.locale === languageFilter,
          ) || false
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          const aName = getProductTranslation(a, locale)?.name || a.key;
          const bName = getProductTranslation(b, locale)?.name || b.key;
          comparison = aName.localeCompare(bName);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "created":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "updated":
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    products,
    searchQuery,
    categoryFilter,
    languageFilter,
    sortBy,
    sortOrder,
    locale,
  ]);

  const handleDeleteConfirm = async () => {
    if (!productToDelete || !onDeleteProduct) return;

    setIsDeleting(true);
    try {
      await onDeleteProduct(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const categoryBadgeVariant = (category: string) => {
    switch (category) {
      case "BASE":
        return "default";
      case "ADD_ON":
        return "secondary";
      case "STANDALONE":
        return "outline";
      default:
        return "outline";
    }
  };

  const categoryLabel = (category: string) => {
    switch (category) {
      case "BASE":
        return "Base Product";
      case "ADD_ON":
        return "Add-on";
      case "STANDALONE":
        return "Standalone";
      default:
        return category;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Products</h1>
          <Badge variant="outline" className="ml-2">
            {filteredAndSortedProducts.length} of {products.length}
          </Badge>
        </div>

        {permissions.canCreate && onCreateProduct && (
          <Button onClick={onCreateProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="BASE">Base Products</SelectItem>
                <SelectItem value="ADD_ON">Add-ons</SelectItem>
                <SelectItem value="STANDALONE">Standalone</SelectItem>
              </SelectContent>
            </Select>

            {/* Language Filter */}
            <Select
              value={languageFilter}
              onValueChange={(value: "en" | "ar" | "all") =>
                setLanguageFilter(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-");
                setSortBy(field as typeof sortBy);
                setSortOrder(order as typeof sortOrder);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="category-asc">Category (A-Z)</SelectItem>
                <SelectItem value="category-desc">Category (Z-A)</SelectItem>
                <SelectItem value="created-desc">Newest First</SelectItem>
                <SelectItem value="created-asc">Oldest First</SelectItem>
                <SelectItem value="updated-desc">Recently Updated</SelectItem>
                <SelectItem value="updated-asc">
                  Least Recently Updated
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-r-transparent" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ||
                categoryFilter !== "all" ||
                languageFilter !== "all"
                  ? "No products found"
                  : "No products yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ||
                categoryFilter !== "all" ||
                languageFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first product"}
              </p>
              {permissions.canCreate &&
                onCreateProduct &&
                searchQuery === "" &&
                categoryFilter === "all" &&
                languageFilter === "all" && (
                  <Button onClick={onCreateProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Product
                  </Button>
                )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Plans</TableHead>
                  <TableHead>Languages</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.map((product) => {
                  const translation = getProductTranslation(product, locale);
                  const activeVersion = product.versions?.[0] || null;
                  const availableLocales =
                    activeVersion?.translations?.map((t) => t.locale) || [];
                  const includes =
                    activeVersion?.includes?.filter(
                      (inc) => inc.inclusionType === "includes",
                    )?.length || 0;
                  const allows =
                    activeVersion?.includes?.filter(
                      (inc) => inc.inclusionType === "allows",
                    )?.length || 0;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {translation?.name || product.key}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.key}
                          </div>
                          {translation?.description && (
                            <div className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
                              {translation.description}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant={categoryBadgeVariant(product.category)}>
                          {categoryLabel(product.category)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {activeVersion?.planVariants?.length || 0} plan
                            {(activeVersion?.planVariants?.length || 0) !== 1
                              ? "s"
                              : ""}
                          </div>
                          {(includes > 0 || allows > 0) && (
                            <div className="flex space-x-2 text-xs text-gray-500">
                              {includes > 0 && <span>{includes} included</span>}
                              {allows > 0 && <span>{allows} allowed</span>}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex space-x-1">
                          {availableLocales.map((langLocale) => (
                            <Badge
                              key={langLocale}
                              variant="outline"
                              className="text-xs"
                            >
                              {langLocale === "en" ? "EN" : "AR"}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          v{product.currentVersion}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {product.updatedAt instanceof Date
                            ? product.updatedAt.toLocaleDateString(
                                locale === "ar" ? "ar-SA" : "en-US",
                              )
                            : new Date(product.updatedAt).toLocaleDateString(
                                locale === "ar" ? "ar-SA" : "en-US",
                              )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            {permissions.canView && onViewProduct && (
                              <DropdownMenuItem
                                onClick={() => onViewProduct(product)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            )}

                            {permissions.canEdit && onEditProduct && (
                              <DropdownMenuItem
                                onClick={() => onEditProduct(product)}
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                            )}

                            {onCloneProduct && (
                              <DropdownMenuItem
                                onClick={() => onCloneProduct(product)}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Clone Product
                              </DropdownMenuItem>
                            )}

                            {permissions.canDelete && onDeleteProduct && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setProductToDelete(product);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Product
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the product "
              {productToDelete
                ? getProductTranslation(productToDelete, locale)?.name ||
                  productToDelete.key
                : "Unknown Product"}
              "? This action cannot be undone and will also delete all
              associated plan variants and pricing references.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Product"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
