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

      // Only send new image files
      images.forEach((file) => {
        formDataObj.append("images", file);
      });

      // Send existing images as JSON array (for images we want to keep)
      const existingImages = previewImages.filter(
        (img) => !img.startsWith("blob:"), // Filter out blob URLs (new files)
      );
      if (existingImages.length > 0) {
        formDataObj.append("existingImages", JSON.stringify(existingImages));
      }

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
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700 w-full max-w-4xl mx-auto pb-32">
      <div className="flex flex-col gap-8">
        
        {/* Product Details Header */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary-custom/10 dark:bg-primary-custom/20 flex items-center justify-center border border-primary-custom/20">
                <Package className="h-5 w-5 text-primary-custom" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Parent Product</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mt-1">Read-Only Information</p>
              </div>
            </div>

            <div className="relative group transition-all duration-500 overflow-hidden bg-white/60 dark:bg-slate-800/40 border border-primary-custom/20 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-2">
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Product {variant.productId}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> ID: {variant.productId}</span>
                    <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /> SKU: {variant.sku}</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 px-4 py-2 rounded-xl text-center self-start sm:self-auto">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Base Price</p>
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">${variant.price?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variant Configuration Stack */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
              <Package className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Variant Configuration</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mt-1">Size & Inventory Settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">SKU</Label>
              <Input
                id="sku"
                value={variant.sku}
                disabled
                className="h-14 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner text-slate-400 font-bold transition-all duration-300"
              />
              <p className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-tighter opacity-70">
                Auto-generated based on product and size
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Size *</Label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., S, M, L, XL"
                required
                className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price</Label>
              <Input
                id="price"
                value={`$${variant.price?.toFixed(2) || "0.00"}`}
                disabled
                className="h-14 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner text-slate-400 font-bold transition-all duration-300"
              />
              <p className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-tighter opacity-70">
                Inherited from parent product
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                placeholder="10"
                className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-rose-500/30 font-bold transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Advanced Interactive Image Upload Center */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center border border-orange-500/20">
                <Image className="h-5 w-5 text-orange-500" alt="icon" src="" aria-label="hidden" />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 outline-none"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Variant Media</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mt-1">Gallery & Assets</p>
              </div>
            </div>
            <span className="bg-white/80 dark:bg-slate-800 py-1.5 px-4 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              {previewImages.length} items
            </span>
          </div>

          <div
            className="group relative overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-primary-custom transition-all duration-500 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white/60 dark:hover:bg-slate-800/80 shadow-inner"
            onClick={() => document.getElementById('variant-images-upload')?.click()}
          >
            <input
              id="variant-images-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                <div className="absolute inset-0 bg-primary-custom/5 rounded-[1.5rem] group-hover:bg-primary-custom/10 transition-colors" />
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-600 group-hover:text-primary-custom relative z-10 transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              </div>
              <div>
                <p className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 mb-1 group-hover:text-primary-custom transition-colors">Click or drag images to upload</p>
                <p className="text-[10px] font-bold text-slate-400 opacity-80 uppercase tracking-tighter">
                  JPG, PNG, WEBP (Multiple Files Supported)
                </p>
              </div>
            </div>
          </div>

          {previewImages.length > 0 && (
            <div className="mt-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative aspect-square group rounded-[1.5rem] overflow-hidden shadow-md ring-2 ring-white/50 border border-slate-200/50 hover:ring-primary-custom/30 transition-all duration-500">
                    <img
                      src={image}
                      alt={`Variant image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-white dark:bg-slate-800"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-10 w-10 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Global Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-8 py-6 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] border border-white/40 dark:border-slate-800/50 shadow-2xl flex items-center justify-between gap-6">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-2xl h-14 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl h-14 min-w-[220px] px-10 bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all active:scale-[0.98] disabled:opacity-50 border-none"
        >
          {isSubmitting ? "Updating..." : "Update Variant"}
        </Button>
      </div>
    </form>
  );
}
