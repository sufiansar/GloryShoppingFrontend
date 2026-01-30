"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Upload, X, Plus, Package, Trash2 } from "lucide-react";
import Image from "next/image";
import ProductSelectionDialog from "./ProductSelectionDialog";
import { Product } from "@/types/product.interface";
import { createProductVariant } from "@/action/variants/variants.action";
import { toast } from "sonner";

export default function CreateVariantForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    size: "",
    stock: "",
    lowStockThreshold: "10",
    price: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formDataObj = new FormData();
      formDataObj.append("productId", selectedProduct?.id || "");
      formDataObj.append("size", formData.size);
      formDataObj.append("stock", formData.stock.toString());
      formDataObj.append(
        "lowStockThreshold",
        formData.lowStockThreshold.toString(),
      );
      if (formData.price) {
        formDataObj.append("price", formData.price.toString());
      }

      if (images.length > 0) {
        images.forEach((file) => {
          formDataObj.append("images", file);
        });
      }

      const result = await createProductVariant(formDataObj);
      if (result.success) {
        toast.success("✅ Variant created successfully!");
        router.push("/admin/dashboard/variants");
        router.refresh();
        return;
      } else {
        toast.error(result.message || "Failed to create variant");
      }
    } catch (error) {
      console.error("Create error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create variant",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "stock" || name === "lowStockThreshold" || name === "price") {
      const numericValue = Math.max(0, Number(value));
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // const handleAddImageUrl = () => {
  //   const url = prompt("Enter image URL:");
  //   if (url && url.trim()) {
  //     setImages((prev) => [...prev, url.trim()]);
  //   }
  // };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setError(null);
  };

  const handleRemoveProduct = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selection Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Select Product *</Label>
                {selectedProduct && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveProduct}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>

              {selectedProduct ? (
                <div className="border rounded-lg p-4 bg-accent/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {selectedProduct?.thumbleImage?.[0] && (
                        <div className="relative w-12 h-12">
                          <Image
                            src={selectedProduct.thumbleImage}
                            alt={selectedProduct.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{selectedProduct.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>SLUG: {selectedProduct.slug || "N/A"}</span>
                          <span>
                            Price: $
                            {selectedProduct.price?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-20 border-dashed"
                  onClick={() => setProductDialogOpen(true)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm">Click to select a product</span>
                    <span className="text-xs text-muted-foreground">
                      Required for creating variant
                    </span>
                  </div>
                </Button>
              )}

              <p className="text-xs text-muted-foreground">
                Variant will inherit base price from selected product
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Variant Details Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size *</Label>
                  <Input
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="e.g., S, M, L, XL or 10, 12, 14"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Variant Price (Optional)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Leave empty to use product price"
                  />
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
                <p className="text-xs text-muted-foreground">
                  Alert when stock falls below this number
                </p>
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
                <div className="flex gap-2">
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImageUrl}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add URL
                  </Button> */}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((file, index) => {
                    const imageUrl = URL.createObjectURL(file); // create temporary URL
                    return (
                      <div key={index} className="relative aspect-square group">
                        <Image
                          src={imageUrl}
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
                    );
                  })}
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No images uploaded yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Upload images or add image URLs
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
          <Button type="submit" disabled={isSubmitting || !selectedProduct}>
            {isSubmitting ? "Creating..." : "Create Variant"}
          </Button>
        </div>
      </form>

      {/* Product Selection Dialog */}
      <ProductSelectionDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        onSelect={handleProductSelect}
      />
    </>
  );
}
