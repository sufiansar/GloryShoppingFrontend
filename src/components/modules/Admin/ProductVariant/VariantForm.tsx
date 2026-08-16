"use client";

import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { useState } from"react";
import { useRouter } from"next/navigation";

import { Upload, X, Plus, Package, Trash2, Box, Layers, Coins, Hash, AlertTriangle, CheckCircle2, Loader2, ImageIcon } from"lucide-react";
import Image from"next/image";
import ProductSelectionDialog from"./ProductSelectionDialog";
import { Product } from"@/types/product.interface";
import { createProductVariant } from"@/action/variants/variants.action";
import { toast } from"sonner";
import { cn } from"@/lib/utils";

export default function CreateVariantForm() {
 const router = useRouter();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [images, setImages] = useState<File[]>([]);

 const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 const [productDialogOpen, setProductDialogOpen] = useState(false);

 const [formData, setFormData] = useState({
 size:"",
 stock:"",
 lowStockThreshold:"10",
 price:"",
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
 formDataObj.append("productId", selectedProduct?.id ||"");
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
 toast.error(result.message ||"Failed to create variant");
 }
 } catch (error) {
 console.error("Create error:", error);
 setError(
 error instanceof Error ? error.message :"Failed to create variant",
 );
 } finally {
 setIsSubmitting(false);
 }
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const { name, value } = e.target;

 if (name ==="stock"|| name ==="lowStockThreshold"|| name ==="price") {
 const numericValue = Math.max(0, Number(value));
 setFormData((prev) => ({ ...prev, [name]: (numericValue ||"").toString() }));
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

 const handleProductSelect = (product: Product) => {
 setSelectedProduct(product);
 setError(null);
 };

 const handleRemoveProduct = () => {
 setSelectedProduct(null);
 };

 return (
 <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
 {/* Decorative Background Blob */}
 <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-custom/10 rounded-full blur-3xl pointer-events-none"/>
 
 <div className="relative z-10">
 <div className="flex items-center gap-4 mb-10">
 <div className="h-14 w-14 rounded-2xl bg-primary-custom/10 dark:bg-primary-custom/20 flex items-center justify-center border border-primary-custom/20 shadow-inner">
 <Layers className="h-7 w-7 text-primary-custom"/>
 </div>
 <div>
 <h1 className="text-3xl font-medium text-slate-900 dark:text-white">Create Product Variant</h1>
 <p className="text-sm font-medium text-slate-400 -mt-1">Define Stock/Size Specifications</p>
 </div>
 </div>

 <form onSubmit={handleSubmit} className="space-y-10">
 {/* Product Selection Section */}
 <div className="bg-white/40 dark:bg-slate-800/20 p-6 rounded-3xl border border-white/40 dark:border-slate-800/50 space-y-6">
 <div className="flex items-center justify-between px-1">
 <div className="flex items-center gap-2">
 <Package className="h-4 w-4 text-primary-custom"/>
 <Label className="text-sm font-medium text-slate-400">Select Product *</Label>
 </div>
 {selectedProduct && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 onClick={handleRemoveProduct}
 className="h-8 rounded-lg px-3 text-[9px] font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all"
 >
 <Trash2 className="mr-1.5 h-3.5 w-3.5"/>
 Remove
 </Button>
 )}
 </div>

 {selectedProduct ? (
 <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-primary/40 dark:border-primary/40 shadow-inner group transition-all duration-500">
 <div className="flex items-center gap-5">
 <div className="relative h-20 w-20 rounded-xl overflow-hidden shadow-lg ring-4 ring-white/30 group-hover:scale-105 transition-transform duration-500">
 <Image
 src={Array.isArray(selectedProduct.thumbleImage) ? selectedProduct.thumbleImage[0] : selectedProduct.thumbleImage ||"/placeholder.png"}
 alt={selectedProduct.name}
 fill
 className="object-cover"
 />
 </div>
 <div className="flex-1 space-y-1">
 <h3 className="text-lg font-medium text-slate-900 dark:text-white leading-none">{selectedProduct.name}</h3>
 <div className="flex flex-wrap items-center gap-4">
 <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
 <span className="text-[8px] font-medium text-slate-400">SLUG:</span>
 <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400">{selectedProduct.slug ||"N/A"}</span>
 </div>
 <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-custom/10 border border-primary-custom/20">
 <span className="text-[8px] font-medium text-primary-custom">Base Price:</span>
 <span className="text-[9px] font-medium text-primary-custom">${selectedProduct.price?.toFixed(2) ||"0.00"}</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 ) : (
 <Button
 type="button"
 variant="outline"
 className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-900/10 hover:border-primary-custom hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-500 group"
 onClick={() => setProductDialogOpen(true)}
 >
 <div className="flex flex-col items-center gap-3">
 <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
 <Box className="h-6 w-6 text-slate-300 dark:text-slate-600 group-hover:text-primary-custom"/>
 </div>
 <div className="text-center">
 <span className="block text-[11px] font-medium text-slate-600 dark:text-slate-300">Click to select a product</span>
 <span className="block text-[9px] font-bold text-slate-400 er opacity-70">Required for creating variant</span>
 </div>
 </div>
 </Button>
 )}

 <div className="flex items-center gap-2 px-1 opacity-60">
 <Box className="h-3 w-3 text-slate-400"/>
 <p className="text-[9px] font-bold text-slate-400 er">
 Variant will inherit base price from selected product
 </p>
 </div>
 </div>

 {/* Variant Details Section */}
 <div className="bg-white/40 dark:bg-slate-800/20 p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 space-y-8">
 <div className="flex items-center gap-2 mb-2 px-1">
 <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
 <Plus className="h-4 w-4 text-indigo-500"/>
 </div>
 <h3 className="text-sm font-medium text-slate-400">
 Variant Details
 </h3>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 <div className="space-y-3">
 <div className="flex items-center gap-2 ml-1">
 <Box className="h-3.5 w-3.5 text-primary-custom"/>
 <Label htmlFor="size"className="text-sm font-medium text-slate-400">Size *</Label>
 </div>
 <Input
 id="size"
 name="size"
 value={formData.size}
 onChange={handleChange}
 placeholder="e.g., S, M, L, XL or 10, 12, 14"
 required
 className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
 />
 </div>

 <div className="space-y-3">
 <div className="flex items-center gap-2 ml-1">
 <Coins className="h-3.5 w-3.5 text-primary-custom"/>
 <Label htmlFor="price"className="text-sm font-medium text-slate-400">Variant Price (Optional)</Label>
 </div>
 <Input
 id="price"
 name="price"
 type="number"
 value={formData.price}
 onChange={handleChange}
 placeholder="Leave empty"
 className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
 />
 </div>

 <div className="space-y-3">
 <div className="flex items-center gap-2 ml-1">
 <Hash className="h-3.5 w-3.5 text-primary-custom"/>
 <Label htmlFor="stock"className="text-sm font-medium text-slate-400">Stock Quantity</Label>
 </div>
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
 </div>

 <div className="space-y-3 pt-2">
 <div className="flex items-center gap-2 ml-1">
 <AlertTriangle className="h-3.5 w-3.5 text-primary-custom"/>
 <Label htmlFor="lowStockThreshold"className="text-sm font-medium text-slate-400">Low Stock Threshold</Label>
 </div>
 <Input
 id="lowStockThreshold"
 name="lowStockThreshold"
 type="number"
 value={formData.lowStockThreshold}
 onChange={handleChange}
 placeholder="10"
 className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
 />
 <p className="text-[9px] font-bold text-slate-400 er ml-1 opacity-70">
 Alert when stock falls below this number
 </p>
 </div>
 </div>

 {/* Images Section */}
 <div className="bg-white/40 dark:bg-slate-800/20 p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 space-y-6">
 <div className="flex items-center justify-between px-1">
 <div className="flex items-center gap-2">
 <ImageIcon className="h-5 w-5 text-primary-custom"/>
 <Label className="text-sm font-medium text-slate-400">Variant Images</Label>
 </div>
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
 variant="ghost"
 size="sm"
 onClick={() => document.getElementById("image-upload")?.click()}
 className="h-10 rounded-xl px-4 bg-primary-custom/10 text-primary-custom font-medium text-[9px] hover:bg-primary-custom/20 transition-all"
 >
 <Upload className="mr-2 h-3.5 w-3.5"/>
 Upload Files
 </Button>
 </div>
 </div>

 {images.length > 0 ? (
 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-2">
 {images.map((file, index) => {
 const imageUrl = URL.createObjectURL(file);
 return (
 <div key={index} className="relative aspect-square group rounded-[1.25rem] overflow-hidden shadow-sm border border-slate-200/50 ring-4 ring-white/30 transition-transform duration-500 hover:scale-[1.05]">
 <Image
 src={imageUrl}
 alt={`Variant image ${index + 1}`}
 fill
 className="object-cover transition-transform duration-700 group-hover:scale-110"
 />
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
 <Button
 type="button"
 size="icon"
 variant="destructive"
 className="h-9 w-9 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform"
 onClick={() => handleRemoveImage(index)}
 >
 <X className="h-5 w-5"/>
 </Button>
 </div>
 </div>
 );
 })}
 </div>
 ) : (
 <div className="py-12 flex flex-col items-center justify-center bg-slate-50/20 dark:bg-slate-900/10 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
 <div className="h-16 w-16 rounded-[1.25rem] bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4">
 <Upload className="h-8 w-8 text-slate-200 dark:text-slate-700"/>
 </div>
 <p className="text-[11px] font-medium text-slate-400">No images uploaded yet</p>
 <p className="text-[9px] font-bold text-slate-400/60 er">Upload visuals to showcase this variant</p>
 </div>
 )}
 </div>

 {error && (
 <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
 <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0"/>
 <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 tracking-wide leading-tight">{error}</p>
 </div>
 )}

 {/* Action Bar */}
 <div className="flex items-center justify-end gap-6 pt-6 border-t border-white/20 dark:border-slate-800/50">
 <Button
 type="button"
 variant="ghost"
 onClick={() => router.back()}
 disabled={isSubmitting}
 className="rounded-xl h-12 px-6 text-sm font-medium text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
 >
 Cancel Session
 </Button>
 <Button 
 type="submit"
 disabled={isSubmitting || !selectedProduct}
 className="rounded-2xl h-14 min-w-[220px] px-10 bg-primary-custom text-white font-medium text-sm shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all active:scale-[0.98] disabled:opacity-50 border-none"
 >
 {isSubmitting ? (
 <div className="flex items-center gap-2">
 <Loader2 className="h-4 w-4 animate-spin"/>
 Spawning...
 </div>
 ) : (
 <div className="flex items-center gap-2">
 <CheckCircle2 className="h-4 w-4"/>
 Create Variant
 </div>
 )}
 </Button>
 </div>
 </form>
 </div>
 </div>

 {/* Product Selection Dialog - Assuming this already exists and is styled elsewhere or works as is */}
 <ProductSelectionDialog
 open={productDialogOpen}
 onOpenChange={setProductDialogOpen}
 onSelect={handleProductSelect}
 />
 </div>
 );
}
