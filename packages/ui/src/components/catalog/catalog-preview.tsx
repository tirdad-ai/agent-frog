"use client";

import React, { useState } from "react";
import { Button } from "../base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../base/card";
import { Input } from "../base/input";
import { Label } from "../base/label";
import { Textarea } from "../base/textarea";
import { Badge } from "../base/badge";
import { Separator } from "../base/separator";
import { Switch } from "../base/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../base/tabs";
import {
  FileText,
  Download,
  Settings,
  Eye,
  Rocket,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Package,
  DollarSign,
  Globe,
  Code,
  Users,
  BarChart3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../base/dialog";

export interface CatalogSummary {
  productCount: number;
  baseProducts: number;
  addonProducts: number;
  standaloneProducts: number;
  planCount: number;
  currencies: string[];
  priceListCount: number;
  effectiveDate: string;
  xmlSize?: number;
}

export interface CatalogVersion {
  id: string;
  versionTag: string;
  effectiveDate: Date;
  notes?: string;
  publishedBy?: string;
  createdAt: Date;
}

export interface PublishResult {
  catalogVersion: CatalogVersion;
  validationResult: {
    valid: boolean;
    messages?: string[];
  };
  summary: CatalogSummary;
}

interface CatalogPreviewProps {
  /** XML content to preview */
  xmlContent: string;
  /** Catalog summary data */
  summary: CatalogSummary;
  /** Loading state for preview generation */
  isLoadingPreview?: boolean;
  /** Loading state for publishing */
  isPublishing?: boolean;
  /** Callback to refresh preview */
  onRefreshPreview?: () => Promise<void>;
  /** Callback to publish catalog */
  onPublish?: (options: {
    versionTag: string;
    effectiveDate?: Date;
    notes?: string;
    validateXSD?: boolean;
  }) => Promise<PublishResult>;
  /** Callback to download XML */
  onDownloadXml?: () => void;
  /** Current user permissions */
  permissions?: {
    canPublish?: boolean;
    canDownload?: boolean;
  };
}

export function CatalogPreview({
  xmlContent,
  summary,
  isLoadingPreview = false,
  isPublishing = false,
  onRefreshPreview,
  onPublish,
  onDownloadXml,
  permissions = {
    canPublish: true,
    canDownload: true,
  },
}: CatalogPreviewProps) {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishFormData, setPublishFormData] = useState({
    versionTag: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    notes: "",
    validateXSD: false,
  });
  const [publishError, setPublishError] = useState<string | null>(null);
  const [lastPublishResult, setLastPublishResult] =
    useState<PublishResult | null>(null);

  const handlePublish = async () => {
    if (!onPublish) return;

    setPublishError(null);

    try {
      const result = await onPublish({
        versionTag: publishFormData.versionTag,
        effectiveDate: publishFormData.effectiveDate
          ? new Date(publishFormData.effectiveDate)
          : undefined,
        notes: publishFormData.notes || undefined,
        validateXSD: publishFormData.validateXSD,
      });

      setLastPublishResult(result);
      setPublishDialogOpen(false);

      // Reset form
      setPublishFormData({
        versionTag: "",
        effectiveDate: new Date().toISOString().split("T")[0],
        notes: "",
        validateXSD: false,
      });
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : "Failed to publish catalog",
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Catalog Preview</h1>
          {summary.xmlSize && (
            <Badge variant="outline">{formatFileSize(summary.xmlSize)}</Badge>
          )}
        </div>

        <div className="flex space-x-3">
          {onRefreshPreview && (
            <Button
              variant="outline"
              onClick={onRefreshPreview}
              disabled={isLoadingPreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isLoadingPreview ? "Refreshing..." : "Refresh"}
            </Button>
          )}

          {permissions.canDownload && onDownloadXml && (
            <Button variant="outline" onClick={onDownloadXml}>
              <Download className="h-4 w-4 mr-2" />
              Download XML
            </Button>
          )}

          {permissions.canPublish && onPublish && (
            <Dialog
              open={publishDialogOpen}
              onOpenChange={setPublishDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Rocket className="h-4 w-4 mr-2" />
                  Publish Catalog
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Publish Catalog</DialogTitle>
                  <DialogDescription>
                    Create a new published version of your catalog with the
                    current data.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {publishError && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200">
                      <div className="flex">
                        <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                        <div className="ml-3">
                          <p className="text-sm text-red-800">{publishError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="versionTag">Version Tag *</Label>
                    <Input
                      id="versionTag"
                      placeholder="e.g., v1.2.0 or 2024-01-15"
                      value={publishFormData.versionTag}
                      onChange={(e) =>
                        setPublishFormData((prev) => ({
                          ...prev,
                          versionTag: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A unique identifier for this version
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="effectiveDate">Effective Date</Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={publishFormData.effectiveDate}
                      onChange={(e) =>
                        setPublishFormData((prev) => ({
                          ...prev,
                          effectiveDate: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      When this catalog version becomes effective
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="notes">Release Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe what changed in this version..."
                      value={publishFormData.notes}
                      onChange={(e) =>
                        setPublishFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="validateXSD"
                      checked={publishFormData.validateXSD}
                      onCheckedChange={(checked) =>
                        setPublishFormData((prev) => ({
                          ...prev,
                          validateXSD: checked,
                        }))
                      }
                    />
                    <Label htmlFor="validateXSD" className="text-sm">
                      Validate against Kill Bill XSD
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPublishDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={
                      !publishFormData.versionTag.trim() || isPublishing
                    }
                  >
                    {isPublishing ? "Publishing..." : "Publish"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Last Publish Result */}
      {lastPublishResult && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-green-800">
                  Catalog published successfully!
                </div>
                <div className="text-sm text-green-700 mt-1">
                  Version "{lastPublishResult.catalogVersion.versionTag}"
                  published on{" "}
                  {lastPublishResult.catalogVersion.createdAt.toLocaleDateString()}
                </div>
                {lastPublishResult.validationResult.messages && (
                  <div className="text-xs text-green-600 mt-2">
                    {lastPublishResult.validationResult.messages.join(", ")}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLastPublishResult(null)}
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Stats */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Catalog Summary</span>
              </CardTitle>
              <CardDescription>
                Overview of your catalog contents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">
                    {summary.productCount}
                  </div>
                  <div className="text-xs text-blue-700">Total Products</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50">
                  <div className="text-2xl font-bold text-green-600">
                    {summary.planCount}
                  </div>
                  <div className="text-xs text-green-700">Total Plans</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Base Products</span>
                  </div>
                  <Badge variant="default">{summary.baseProducts}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Add-ons</span>
                  </div>
                  <Badge variant="secondary">{summary.addonProducts}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Standalone</span>
                  </div>
                  <Badge variant="outline">{summary.standaloneProducts}</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Currencies</span>
                  </div>
                  <div className="flex space-x-1">
                    {summary.currencies.map((currency) => (
                      <Badge
                        key={currency}
                        variant="outline"
                        className="text-xs"
                      >
                        {currency}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Price Lists</span>
                  </div>
                  <Badge variant="outline">{summary.priceListCount}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Effective Date</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(summary.effectiveDate)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* XML Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Generated XML</span>
              </CardTitle>
              <CardDescription>
                Kill Bill compatible catalog XML
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPreview ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-r-transparent" />
                  <span className="ml-2 text-gray-600">
                    Generating preview...
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-96 border">
                    <code>{xmlContent}</code>
                  </pre>

                  {permissions.canDownload && onDownloadXml && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={onDownloadXml}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
