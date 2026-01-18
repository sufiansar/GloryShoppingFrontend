"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { X, Package } from "lucide-react";
import Image from "next/image";
import { ProductVariant } from "@/types/variants.interface";
import { updateProductVariant } from "@/action/variants/variants.action";
import { toast } from "sonner";

interface EditVariantFormProps {
  variant: ProductVariant;
}

export default function EditVariantForm({ variant }: EditVariantFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]); // store files
  const [previewImages, setPreviewImages] = useState<string[]>(
    variant.images || [],
  ); // preview URLs

  const [formData, setFormData] = useState({
    size: variant.size,
    stock: variant.stock?.toString() || "",
    lowStockThreshold: variant.lowStockThreshold?.toString() || "10",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const formDataObj = new FormData();
      formDataObj.append("size", formData.size);
      formDataObj.append("stock", formData.stock);
      formDataObj.append("lowStockThreshold", formData.lowStockThreshold);

      images.forEach((file) => {
        formDataObj.append("images", file);
      });

      const result = await updateProductVariant(variant.id, formDataObj);
      if (result.success) {
        toast.success("✅ Variant updated successfully!");
        router.push("/admin/dashboard/variants");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update variant");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update variant",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    setImages((prev) => [...prev, ...filesArray]);

    // add preview URLs
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Information Card (Read-only) */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label>Product Information</Label>

            <div className="border rounded-lg p-4 bg-accent/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Product {variant.productId}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Product ID: {variant.productId}</span>
                      <span>SKU: {variant.sku}</span>
                      <span>
                        Base Price: ${variant.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Product cannot be changed after variant creation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variant Details Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={variant.sku}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated based on product and size
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size *</Label>
                <Input
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="e.g., S, M, L, XL"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={`$${variant.price?.toFixed(2) || "0.00"}`}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Inherited from product
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                placeholder="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Variant Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {previewImages.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={image}
                      alt={`Variant image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No images for this variant
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Variant"}
        </Button>
      </div>
    </form>
  );
}
