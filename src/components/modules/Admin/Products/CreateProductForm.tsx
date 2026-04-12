"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
  Info,
  CheckCircle2,
  AlertCircle,
  Hash,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { createProduct } from "@/action/product/product.action";
import BrandSelectionDialog from "./BrandSelectionDialog";
import CategorySelectionDialog from "./CategorySelectionDialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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

export default function CreateProductForm() {
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
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    longDesc: "",
    faquestions: "",
    price: "",
    discount: "",
    stock: "",
    isNew: false,
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    isActive: true,
  });

  const [thumbImage, setThumbImage] = useState<string>("");
  const [thumbImageFile, setThumbImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBrand) {
      setError("Please select a brand");
      return;
    }

    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formDataObj = new FormData();

      // Basic information
      formDataObj.append("name", formData.name);
      formDataObj.append("slug", formData.slug);
      formDataObj.append("description", formData.description);
      formDataObj.append("shortDesc", formData.shortDesc);
      formDataObj.append("longDesc", formData.longDesc);
      formDataObj.append("faquestions", formData.faquestions);

      // Pricing and stock
      formDataObj.append("price", formData.price);
      formDataObj.append("discount", formData.discount || "0");
      formDataObj.append("stock", formData.stock);

      // Flags
      formDataObj.append("isNew", formData.isNew.toString());
      formDataObj.append("isFeatured", formData.isFeatured.toString());
      formDataObj.append("isTrending", formData.isTrending.toString());
      formDataObj.append("isBestSeller", formData.isBestSeller.toString());
      formDataObj.append("isActive", formData.isActive.toString());

      // Relationships
      formDataObj.append("brandId", selectedBrand.id);
      formDataObj.append("categoryId", selectedCategory.id);

      // Thumb image
      if (thumbImageFile) {
        formDataObj.append("thumbleImage", thumbImageFile);
      } else if (thumbImage) {
        formDataObj.append("thumbleImage", JSON.stringify([thumbImage]));
      }

      await createProduct(formDataObj);

      toast.success("Product created successfully");
      router.push("/admin/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error("Create error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create product",
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
      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700 w-full max-w-4xl mx-auto pb-32">
        <div className="flex flex-col gap-8">
          
          {/* Main Configuration Stack */}
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary-custom/10 dark:bg-primary-custom/20 flex items-center justify-center border border-primary-custom/20">
                  <Package className="h-5 w-5 text-primary-custom" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Basic Information</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mt-1">Primary Product Details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Name *</Label>
                  <div className="relative group/input">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                      className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slug</Label>
                  <div className="relative group/input">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-primary-custom transition-colors" />
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="product-slug"
                      className="h-14 pl-11 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-tighter opacity-70">
                    URL-friendly version of the name
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={3}
                  className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDesc" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Short Description</Label>
                <Textarea
                  id="shortDesc"
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleChange}
                  placeholder="Brief description for listings"
                  rows={2}
                  className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                />
              </div>
            </div>

            {/* Selection Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Selection */}
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary-custom" />
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand *</Label>
                  </div>
                  {selectedBrand && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setBrandDialogOpen(true)}
                      className="rounded-xl h-8 text-[9px] font-black uppercase tracking-widest text-primary-custom hover:bg-primary-custom/10"
                    >
                      Change
                    </Button>
                  )}
                </div>

                {selectedBrand ? (
                  <div className="relative group transition-all duration-500 overflow-hidden bg-white/60 dark:bg-slate-800/40 border border-primary-custom/20 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-white">
                        <Building2 className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="flex-1 truncate">
                        <h3 className="font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{selectedBrand.name}</h3>
                        {selectedBrand.country && (
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                            {selectedBrand.country}
                          </p>
                        )}
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-24 border-dashed border-2 border-primary/40 dark:border-primary/40 bg-white/20 dark:bg-slate-800/10 rounded-2xl hover:border-primary-custom hover:bg-white/40 transition-all group"
                    onClick={() => setBrandDialogOpen(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="h-5 w-5 text-slate-400 group-hover:text-primary-custom transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Brand</span>
                    </div>
                  </Button>
                )}
              </div>

              {/* Category Selection */}
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-primary-custom" />
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category *</Label>
                  </div>
                  {selectedCategory && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoryDialogOpen(true)}
                      className="rounded-xl h-8 text-[9px] font-black uppercase tracking-widest text-primary-custom hover:bg-primary-custom/10"
                    >
                      Change
                    </Button>
                  )}
                </div>

                {selectedCategory ? (
                  <div className="relative group transition-all duration-500 overflow-hidden bg-white/60 dark:bg-slate-800/40 border border-primary-custom/20 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-white">
                        <Folder className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="flex-1 truncate">
                        <h3 className="font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{selectedCategory.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                          {selectedCategory.description || "No description"}
                        </p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-24 border-dashed border-2 border-primary/40 dark:border-primary/40 bg-white/20 dark:bg-slate-800/10 rounded-2xl hover:border-primary-custom hover:bg-white/40 transition-all group"
                    onClick={() => setCategoryDialogOpen(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="h-5 w-5 text-slate-400 group-hover:text-primary-custom transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Category</span>
                    </div>
                  </Button>
                )}
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary-custom/10 dark:bg-primary-custom/20 flex items-center justify-center border border-primary-custom/20">
                  <Info className="h-5 w-5 text-primary-custom" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Additional Information</h2>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDesc" className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                  <FileText className="h-3 w-3" />
                  Long Description
                </Label>
                <Textarea
                  id="longDesc"
                  name="longDesc"
                  value={formData.longDesc}
                  onChange={handleChange}
                  placeholder="Detailed product description"
                  rows={6}
                  className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="faquestions"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1"
                >
                  <Tag className="h-3 w-3" />
                  FAQ Questions (JSON)
                </Label>
                <Textarea
                  id="faquestions"
                  name="faquestions"
                  value={formData.faquestions}
                  onChange={handleChange}
                  placeholder='[{"question": "Q1", "answer": "A1"}, ...]'
                  rows={3}
                  className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-mono font-bold text-xs transition-all duration-300"
                />
                <p className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-tighter opacity-70">
                  Enter FAQ questions and answers in JSON format
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Information Stack */}
          <div className="space-y-8">
            {/* Pricing & Logic Area */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Pricing & Stock</h2>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">Price ($) *</Label>
                  <div className="relative group/input">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-emerald-500" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      className="h-14 pl-12 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-emerald-500/30 text-lg font-black transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                    className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stock *</Label>
                  <div className="relative group/input">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      required
                      className="h-14 pl-11 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Upload Hub */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary-custom" />
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thumbnail</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleAddImageUrl}
                    className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                    title="Add URL"
                  >
                    <Plus className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    className="h-8 w-8 rounded-lg bg-primary-custom/10 text-primary-custom hover:bg-primary-custom/20"
                    title="Upload File"
                  >
                    <Upload className="h-3.5 w-3.5" />
                  </Button>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                </div>
              </div>

              {thumbImage ? (
                <div className="relative group w-full h-64 rounded-3xl overflow-hidden shadow-md ring-4 ring-white/50 border border-slate-200/50">
                  <Image
                    src={thumbImage}
                    alt="Thumbnail preview"
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105 bg-white/20 dark:bg-slate-800/20"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-10 w-10 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-64 rounded-[2.5rem] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white/60 dark:hover:bg-slate-800/80 hover:border-primary-custom transition-all duration-500 overflow-hidden group shadow-inner"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer relative z-10">
                    <div className="h-20 w-20 rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                      <div className="absolute inset-0 bg-primary-custom/5 rounded-[1.5rem] group-hover:bg-primary-custom/10 transition-colors" />
                      <Upload className="h-10 w-10 text-slate-300 dark:text-slate-600 group-hover:text-primary-custom relative z-10 transition-colors" />
                    </div>
                    <div className="text-center px-6">
                      <p className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 mb-1 group-hover:text-primary-custom transition-colors">Click to Browse or Drag Image Here</p>
                      <p className="text-[10px] font-bold text-slate-400 opacity-80 uppercase tracking-tighter">Supports JPG, PNG, WEBP (Maximum 5MB)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Strategic Flags Hub */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                  <Tag className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Product Flags</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "isNew", label: "Mark as New" },
                  { id: "isFeatured", label: "Mark as Featured" },
                  { id: "isTrending", label: "Mark as Trending" },
                  { id: "isBestSeller", label: "Mark as Best Seller" }
                ].map((flag) => (
                  <div key={flag.id} className="flex items-center justify-between p-4 bg-white/20 dark:bg-slate-800/20 rounded-2xl border border-white/10">
                    <Label htmlFor={flag.id} className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 cursor-pointer">
                      {flag.label}
                    </Label>
                    <Switch
                      id={flag.id}
                      checked={(formData as any)[flag.id]}
                      onCheckedChange={(checked) => handleSwitchChange(flag.id, checked)}
                      className="data-[state=checked]:bg-primary-custom"
                    />
                  </div>
                ))}
              </div>

              <Separator className="bg-slate-200/40 dark:bg-slate-800/30 my-6" />

              <div className="space-y-3">
                <Label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Status</Label>
                <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl transition-all duration-500 border border-transparent">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-2.5 w-2.5 rounded-full shadow-[0_0_8px]",
                      formData.isActive 
                        ? "bg-primary-custom shadow-primary-custom/50" 
                        : "bg-rose-500 shadow-rose-500/50"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500 text-white px-8 py-5 rounded-[2rem] shadow-xl shadow-rose-500/20 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-500">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/70 leading-none mb-1">System Exception</p>
              <p className="text-sm font-black uppercase tracking-tight">{error}</p>
            </div>
          </div>
        )}

        {/* Global Action Bar */}
        <div className="sticky bottom-8 z-50 w-full px-8 py-6 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] border border-white/40 dark:border-slate-800/50 shadow-2xl flex items-center justify-between gap-6">
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
            disabled={isSubmitting || !selectedBrand || !selectedCategory}
            className="rounded-2xl h-14 flex-1 w-full px-10 bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all active:scale-[0.98] disabled:opacity-50 border-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Create Product
              </div>
            )}
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
