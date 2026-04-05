"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Upload,
  X,
  Plus,
  Building2,
  Folder,
  DollarSign,
  Package,
  Tag,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product.interface";
import { updateProduct } from "@/action/product/product.action";
import { toast } from "sonner";
import BrandSelectionDialog from "./BrandSelectionDialog";
import CategorySelectionDialog from "./CategorySelectionDialog";

interface Brand {
  id: string;
  name: string;
  country?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface EditProductFormProps {
  product: Product;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selection states
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug || "",
    description: product.description || "",
    shortDesc: product.shortDesc || "",
    longDesc: product.description || "",
    // faquestions: product.faquestions || "",
    price: product.price?.toString() || "",
    discount: product.discount?.toString() || "",
    stock: product.stock?.toString() || "",
    isNew: product.isNew || false,
    isFeatured: product.isFeatured || false,
    isTrending: product.isTrending || false,
    isBestSeller: product.isBestSeller || false,
    isActive: product.isActive !== false,
  });

  const [thumbImage, setThumbImage] = useState<string>(
    product.thumbleImage || "",
  );
  const [thumbImageFile, setThumbImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Initialize brand and category from product data
    if (product.brand) {
      setSelectedBrand({
        id: product.brand.id || product.brandId || "",
        name: product.brand.name,
        country: product.brand.country || undefined,
      });
    } else if (product.brandId && product.brandName) {
      setSelectedBrand({
        id: product.brandId,
        name: product.brandName,
      });
    }

    if (product.category) {
      setSelectedCategory({
        id: product.category.id || product.categoryId || "",
        name: product.category.name,
      });
    } else if (product.categoryId && product.categoryName) {
      setSelectedCategory({
        id: product.categoryId,
        name: product.categoryName,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const formDataObj = new FormData();

      // Append all form fields directly
      formDataObj.append("name", formData.name);
      formDataObj.append("slug", formData.slug);
      formDataObj.append("description", formData.description);
      formDataObj.append("shortDesc", formData.shortDesc);
      formDataObj.append("longDesc", formData.longDesc);
      formDataObj.append("price", formData.price);
      formDataObj.append("discount", formData.discount || "0");
      formDataObj.append("stock", formData.stock);
      formDataObj.append("isNew", String(formData.isNew));
      formDataObj.append("isFeatured", String(formData.isFeatured));
      formDataObj.append("isTrending", String(formData.isTrending));
      formDataObj.append("isBestSeller", String(formData.isBestSeller));
      formDataObj.append("isActive", String(formData.isActive));

      // Relationships
      if (selectedBrand?.id) {
        formDataObj.append("brandId", selectedBrand.id);
      }
      if (selectedCategory?.id) {
        formDataObj.append("categoryId", selectedCategory.id);
      }

      // Handle image
      if (thumbImageFile) {
        formDataObj.append("thumbleImage", thumbImageFile);
      } else if (thumbImage) {
        formDataObj.append("thumbleImage", JSON.stringify([thumbImage]));
      } else {
        formDataObj.append("thumbleImage", JSON.stringify([]));
      }

      const result = await updateProduct(product?.id!, formDataObj);

      if (result?.success || result?.id) {
        toast.success("✅ Product updated successfully!");
        router.push("/admin/dashboard/products");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setThumbImage("");
    setThumbImageFile(null);
  };

  const handleAddImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim()) {
      setThumbImage(url.trim());
      setThumbImageFile(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="product-slug"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL-friendly version of the name
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDesc">Short Description</Label>
                <Textarea
                  id="shortDesc"
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleChange}
                  placeholder="Brief description for listings"
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand and Category Selection (Read-only) */}
        <div className="grid grid-cols-2 gap-6">
          {/* Brand Selection */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Brand</Label>
                  {selectedBrand && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setBrandDialogOpen(true)}
                    >
                      Change
                    </Button>
                  )}
                </div>

                {selectedBrand ? (
                  <div className="border rounded-lg p-4 bg-accent/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{selectedBrand.name}</h3>
                          {selectedBrand.country && (
                            <p className="text-sm text-muted-foreground">
                              {selectedBrand.country}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-20 border-dashed"
                    onClick={() => setBrandDialogOpen(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm">Select Brand</span>
                    </div>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Category</Label>
                  {selectedCategory && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoryDialogOpen(true)}
                    >
                      Change
                    </Button>
                  )}
                </div>

                {selectedCategory ? (
                  <div className="border rounded-lg p-4 bg-accent/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Folder className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">
                            {selectedCategory.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {selectedCategory.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-20 border-dashed"
                    onClick={() => setCategoryDialogOpen(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Folder className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm">Select Category</span>
                    </div>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing and Stock */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Flags */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium">Product Flags</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isNew" className="cursor-pointer">
                    Mark as New
                  </Label>
                  <Switch
                    id="isNew"
                    checked={formData.isNew}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isNew", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Mark as Featured
                  </Label>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isFeatured", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isTrending" className="cursor-pointer">
                    Mark as Trending
                  </Label>
                  <Switch
                    id="isTrending"
                    checked={formData.isTrending}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isTrending", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isBestSeller" className="cursor-pointer">
                    Mark as Best Seller
                  </Label>
                  <Switch
                    id="isBestSeller"
                    checked={formData.isBestSeller}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isBestSeller", checked)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <Label htmlFor="isActive" className="cursor-pointer">
                  Product Status
                </Label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${formData.isActive ? "text-green-600" : "text-red-600"}`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isActive", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Image */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Thumbnail Image</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImageUrl}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add URL
                  </Button>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
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

              {thumbImage ? (
                <div className="relative">
                  <div className="relative w-32 h-32 mx-auto">
                    <Image
                      src={thumbImage}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No thumbnail image</p>
                  <p className="text-sm text-muted-foreground">
                    Upload an image or add image URL
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="longDesc" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Long Description
                </Label>
                <Textarea
                  id="longDesc"
                  name="longDesc"
                  value={formData.longDesc}
                  onChange={handleChange}
                  placeholder="Detailed product description"
                  rows={4}
                />
              </div>

              {/* <div className="space-y-2">
                <Label
                  htmlFor="faquestions"
                  className="flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  FAQ Questions (JSON)
                </Label>
                <Textarea
                  id="faquestions"
                  name="faquestions"
                  value={formData.faquestions}
                  onChange={handleChange}
                  placeholder='[{"question": "Q1", "answer": "A1"}, ...]'
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Enter FAQ questions and answers in JSON format
                </p>
              </div> */}
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
            {isSubmitting ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>

      {/* Dialogs */}
      <BrandSelectionDialog
        open={brandDialogOpen}
        onOpenChange={setBrandDialogOpen}
        onSelect={setSelectedBrand}
      />

      <CategorySelectionDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSelect={setSelectedCategory}
      />
    </>
  );
}
