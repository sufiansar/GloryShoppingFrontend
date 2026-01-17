"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductVariant } from "@/types/variants.interface";
import Image from "next/image";
import {
  Package,
  Tag,
  Ruler,
  DollarSign,
  Box,
  AlertTriangle,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

interface VariantDetailsProps {
  variant: ProductVariant;
}

export default function VariantDetails({ variant }: VariantDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>SKU</span>
              </div>
              <Badge variant="outline" className="font-mono text-base">
                {variant.sku}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Product ID</span>
              </div>
              <p className="font-medium">{variant.productId}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ruler className="h-4 w-4" />
                <span>Size</span>
              </div>
              <Badge className="text-base">{variant.size}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Price</span>
              </div>
              <p className="text-2xl font-bold">
                ${variant.price?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Box className="h-4 w-4" />
                <span>Stock</span>
              </div>
              <Badge
                variant={
                  variant.stock === 0
                    ? "destructive"
                    : variant.stock &&
                        variant.stock < (variant.lowStockThreshold || 10)
                      ? "secondary"
                      : "default"
                }
                className="text-lg px-4 py-2"
              >
                {variant.stock || 0} units
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Low Stock Threshold</span>
              </div>
              <p className="text-lg font-medium">
                {variant.lowStockThreshold || 10} units
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>Created</span>
            </div>
            <p>{new Date(variant.createdAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Images Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Images ({variant.images?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {variant.images && variant.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {variant.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`Variant image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No images available for this variant
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
