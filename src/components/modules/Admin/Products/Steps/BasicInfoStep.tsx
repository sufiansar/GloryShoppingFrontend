import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Textarea } from"@/components/ui/textarea";
import { Button } from"@/components/ui/button";
import { Switch } from"@/components/ui/switch";
import { Separator } from"@/components/ui/separator";
import {
 Package, Hash, DollarSign, Image as ImageIcon, Plus, Upload, X, Tag,
 Building2, Folder, CheckCircle2
} from"lucide-react";
import Image from"next/image";
import { useState } from"react";
import { uploadMultipleImages } from"@/action/upload/upload.action";
import { toast } from"sonner";
import { cn } from"@/lib/utils";

interface BasicInfoStepProps {
 formData: any;
 setFormData: (data: any) => void;
 handleChange: (e: any) => void;
 handleSwitchChange: (name: string, checked: boolean) => void;
}

export default function BasicInfoStep({ formData, setFormData, handleChange, handleSwitchChange }: BasicInfoStepProps) {
 const [isUploading, setIsUploading] = useState(false);

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;

 try {
 setIsUploading(true);
 const uploadData = new FormData();
 uploadData.append("images", file);

 const res = await uploadMultipleImages(uploadData);
 
 if (res?.success && res?.data?.urls?.length > 0) {
 setFormData({ ...formData, thumbleImage: res.data.urls[0] });
 toast.success("Image uploaded successfully");
 } else {
 throw new Error("Failed to upload image");
 }
 } catch (error) {
 toast.error("Failed to upload image");
 } finally {
 setIsUploading(false);
 }
 };

 const handleAddImageUrl = () => {
 const url = prompt("Enter image URL:");
 if (url && url.trim()) {
 setFormData({ ...formData, thumbleImage: url.trim() });
 }
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-500">
 {/* Basic Information */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
 <div className="flex items-center gap-3 mb-2">
 <div className="h-10 w-10 rounded-xl bg-primary-custom/10 dark:bg-primary-custom/20 flex items-center justify-center border border-primary-custom/20">
 <Package className="h-5 w-5 text-primary-custom"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">Basic Information</h2>
 <p className="text-sm font-medium text-slate-400 -mt-1">Primary Product Details</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <Label htmlFor="name"className="text-sm font-medium text-slate-400 ml-1">Product Name *</Label>
 <Input id="name"name="name"value={formData.name} onChange={handleChange} placeholder="Enter product name"required className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold"/>
 </div>
 <div className="space-y-2">
 <Label htmlFor="slug"className="text-sm font-medium text-slate-400 ml-1">Slug</Label>
 <div className="relative group/input">
 <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-primary-custom transition-colors"/>
 <Input id="slug"name="slug"value={formData.slug} onChange={handleChange} placeholder="product-slug"className="h-14 pl-11 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold"/>
 </div>
 </div>
 </div>
 <div className="space-y-2">
 <Label htmlFor="description"className="text-sm font-medium text-slate-400 ml-1">Description</Label>
 <Textarea id="description"name="description"value={formData.description} onChange={handleChange} placeholder="Enter product description"rows={3} className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold"/>
 </div>
 <div className="space-y-2">
 <Label htmlFor="shortDesc"className="text-sm font-medium text-slate-400 ml-1">Short Description</Label>
 <Textarea id="shortDesc"name="shortDesc"value={formData.shortDesc} onChange={handleChange} placeholder="Brief description for listings"rows={2} className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold"/>
 </div>
 <div className="space-y-2">
 <Label htmlFor="longDesc"className="text-sm font-medium text-slate-400 ml-1">Long Description</Label>
 <Textarea id="longDesc"name="longDesc"value={formData.longDesc} onChange={handleChange} placeholder="Detailed product description"rows={4} className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold"/>
 </div>
 </div>



 {/* Pricing & Logic Area */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
 <DollarSign className="h-5 w-5 text-emerald-500"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">Pricing & Stock</h2>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <Label htmlFor="price"className="text-sm font-medium text-slate-400 flex items-center gap-2 ml-1">Base Price (৳) *</Label>
 <div className="relative group/input">
 <Input id="price"name="price"type="number"step="0.01"value={formData.price} onChange={handleChange} placeholder="0.00"required className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold"/>
 </div>
 </div>
 <div className="space-y-2">
 <Label htmlFor="discount"className="text-sm font-medium text-slate-400 ml-1">Discount (%)</Label>
 <Input id="discount"name="discount"type="number"step="0.01"value={formData.discount} onChange={handleChange} placeholder="0"className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold"/>
 </div>
 <div className="space-y-2">
 <Label htmlFor="stock"className="text-sm font-medium text-slate-400 ml-1">Stock *</Label>
 <Input id="stock"name="stock"type="number"value={formData.stock} onChange={handleChange} placeholder="0"required className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold"/>
 </div>
 </div>
 </div>

 {/* Thumbnail Upload */}
 <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] space-y-8 relative overflow-hidden group/card">
 
 {/* Subtle background glow effect */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/5 rounded-full blur-3xl opacity-50 pointer-events-none"/>

 <div className="flex items-center justify-between relative z-10">
 <div className="flex items-center gap-3">
 <div className="h-12 w-12 rounded-2xl bg-primary-custom/10 flex items-center justify-center border border-primary-custom/20 shadow-inner">
 <ImageIcon className="h-5 w-5 text-primary-custom"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">Main Thumbnail</h2>
 <p className="text-sm font-medium text-slate-400 mt-0.5">High-quality image</p>
 </div>
 </div>
 <div className="flex gap-3">
 <Button type="button"variant="outline"onClick={handleAddImageUrl} className="h-10 px-4 rounded-xl font-bold text-xs bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"title="Add URL">
 <Plus className="h-4 w-4 mr-2"/>
 Add URL
 </Button>
 <Button type="button"onClick={() => document.getElementById("image-upload")?.click()} className="h-10 px-4 rounded-xl font-bold text-xs bg-primary-custom hover:bg-primary-custom/90 text-white shadow-md shadow-primary-custom/20"title="Upload File">
 <Upload className="h-4 w-4 mr-2"/>
 Upload Image
 </Button>
 <Input type="file"accept="image/*"onChange={handleImageUpload} className="hidden"id="image-upload"disabled={isUploading} />
 </div>
 </div>

 <div className="relative z-10 w-full">
 {formData.thumbleImage ? (
 <div className="relative group w-full h-72 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/50 border border-slate-200/50 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800">
 <Image src={formData.thumbleImage} alt="Thumbnail preview"fill className="object-cover md:object-contain transition-transform duration-700 group-hover:scale-105"/>
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
 <Button type="button"variant="destructive"className="h-12 w-12 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 delay-100"onClick={() => setFormData({ ...formData, thumbleImage:""})}>
 <X className="h-6 w-6"/>
 </Button>
 </div>
 </div>
 ) : (
 <div 
 className="w-full h-72 rounded-[2.5rem] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:border-primary-custom/50 cursor-pointer flex flex-col items-center justify-center relative group transition-all duration-500 overflow-hidden"
 onClick={() => document.getElementById("image-upload")?.click()}
 >
 {isUploading ? (
 <div className="flex flex-col items-center gap-4">
 <div className="relative w-16 h-16">
 <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
 <div className="absolute inset-0 rounded-full border-4 border-primary-custom border-t-transparent animate-spin"></div>
 </div>
 <p className="text-xs font-medium text-primary-custom animate-pulse">Uploading Image...</p>
 </div>
 ) : (
 <>
 <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
 <div className="h-24 w-24 rounded-3xl bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex items-center justify-center group-hover:-translate-y-2 transition-all duration-500 mb-6 relative z-10 group-hover:shadow-[0_8px_30px_rgba(255,51,102,0.2)]">
 <Upload className="h-10 w-10 text-slate-300 dark:text-slate-500 group-hover:text-primary-custom transition-colors duration-500"/>
 </div>
 <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 relative z-10 group-hover:text-primary-custom transition-colors">Drop Image Here or Click</h3>
 <p className="text-sm font-bold text-slate-400 relative z-10">PNG, JPG up to 5MB</p>
 </>
 )}
 </div>
 )}
 </div>
 </div>

 {/* Strategic Flags */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
 <Tag className="h-5 w-5 text-indigo-500"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">Product Flags</h2>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {[
    { id: "isNew", label: "Mark as New", color: "data-[state=checked]:!bg-blue-500", activeBg: "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30" },
    { id: "isFeatured", label: "Mark as Featured", color: "data-[state=checked]:!bg-amber-500", activeBg: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30" },
    { id: "isTrending", label: "Mark as Trending", color: "data-[state=checked]:!bg-violet-500", activeBg: "bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/30" },
    { id: "isBestSeller", label: "Mark as Best Seller", color: "data-[state=checked]:!bg-rose-500", activeBg: "bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30" },
    { id: "isStock", label: "Mark as In Stock", color: "data-[state=checked]:!bg-emerald-500", activeBg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30" }
  ].map((flag) => {
    const isActive = (formData as any)[flag.id];
    return (
      <div 
        key={flag.id} 
        className={`flex items-center justify-between p-4 rounded-2xl border transition-colors duration-300 ${
          isActive 
            ? flag.activeBg 
            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        <Label htmlFor={flag.id} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex-1">
          {flag.label}
        </Label>
        <Switch 
          id={flag.id} 
          checked={isActive} 
          onCheckedChange={(checked) => handleSwitchChange(flag.id, checked)} 
          className={`data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600 ${flag.color}`}
        />
      </div>
    );
  })}
 </div>

 <Separator className="bg-slate-200/40 dark:bg-slate-800/30 my-6"/>

 <div className="space-y-3">
 <Label htmlFor="isActive"className="text-sm font-medium text-slate-400 ml-1">Product Status</Label>
 <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-primary-custom/5 dark:bg-primary-custom/10 text-slate-800 dark:text-white border border-primary-custom/20 dark:border-primary-custom/30 shadow-sm transition-all duration-500">
 <div className="flex items-center gap-3">
 <div className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_8px]", formData.isActive ?"bg-primary-custom shadow-primary-custom/50":"bg-rose-500 shadow-rose-500/50")} />
 <span className="text-sm font-medium">{formData.isActive ?"Active":"Inactive"}</span>
 </div>
 <Switch id="isActive"checked={formData.isActive} onCheckedChange={(checked) => handleSwitchChange("isActive", checked)} className="data-[state=checked]:bg-primary-custom data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600"/>
 </div>
 </div>
 </div>

 </div>
 );
}
