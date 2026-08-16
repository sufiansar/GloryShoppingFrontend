import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Button } from"@/components/ui/button";
import { Image as ImageIcon, Plus, Trash2, Upload, X, Box } from"lucide-react";
import Image from"next/image";
import { useState } from"react";
import { uploadMultipleImages } from"@/action/upload/upload.action";
import { toast } from"sonner";
import { cn } from"@/lib/utils";

interface VariantsStepProps {
 formData: any;
 setFormData: (data: any) => void;
}

export default function VariantsStep({ formData, setFormData }: VariantsStepProps) {
 const [uploadingVariantIndex, setUploadingVariantIndex] = useState<number | null>(null);

 const addVariant = () => {
 setFormData({
 ...formData,
 variants: [
 ...formData.variants,
 { sku:"", size:"", price:"", stock:"", lowStockThreshold:"", images: [] }
 ]
 });
 };

 const removeVariant = (index: number) => {
 const newVariants = [...formData.variants];
 newVariants.splice(index, 1);
 setFormData({ ...formData, variants: newVariants });
 };

 const handleVariantChange = (index: number, field: string, value: any) => {
 const newVariants = [...formData.variants];
 newVariants[index] = { ...newVariants[index], [field]: value };
 setFormData({ ...formData, variants: newVariants });
 };

 const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
 const files = e.target.files;
 if (!files || files.length === 0) return;

 try {
 setUploadingVariantIndex(index);
 const uploadData = new FormData();
 for (let i = 0; i < files.length; i++) {
 uploadData.append("images", files[i]);
 }

 const res = await uploadMultipleImages(uploadData);
 
 if (res?.success && res?.data?.urls?.length > 0) {
 const newVariants = [...formData.variants];
 newVariants[index].images = [...newVariants[index].images, ...res.data.urls];
 setFormData({ ...formData, variants: newVariants });
 toast.success("Images uploaded successfully");
 } else {
 throw new Error("Failed to upload images");
 }
 } catch (error) {
 toast.error("Failed to upload images");
 } finally {
 setUploadingVariantIndex(null);
 }
 };

 const removeVariantImage = (variantIndex: number, imageIndex: number) => {
 const newVariants = [...formData.variants];
 newVariants[variantIndex].images.splice(imageIndex, 1);
 setFormData({ ...formData, variants: newVariants });
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-500">
 <div className="flex items-center justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm">
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
 <Box className="h-5 w-5 text-purple-500"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">Product Variants</h2>
 <p className="text-sm font-medium text-slate-400 -mt-1">Add sizes, colors, etc.</p>
 </div>
 </div>
 <Button type="button"onClick={addVariant} className="rounded-xl h-10 px-6 bg-purple-500 hover:bg-purple-600 text-white font-medium text-sm shadow-lg shadow-purple-500/20 transition-all active:scale-95 border-none">
 <Plus className="h-4 w-4 mr-2"/>
 Add Variant
 </Button>
 </div>

 {formData.variants.length === 0 ? (
 <div className="text-center py-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700">
 <Box className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4"/>
 <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">No Variants</h3>
 <p className="text-sm font-bold text-slate-400">Click 'Add Variant' to create options for this product.</p>
 </div>
 ) : (
 formData.variants.map((variant: any, index: number) => (
 <div key={index} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6 relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-4">
 <Button type="button"variant="destructive"size="icon"onClick={() => removeVariant(index)} className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
 <Trash2 className="h-4 w-4"/>
 </Button>
 </div>
 
 <h3 className="text-sm font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">Variant {index + 1}</h3>
 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 <div className="space-y-2">
 <Label className="text-sm font-medium text-slate-400 ml-1">SKU *</Label>
 <Input value={variant.sku} onChange={(e) => handleVariantChange(index,"sku", e.target.value)} placeholder="e.g. HA-SERUM-30ML"required className="h-12 bg-white/60 dark:bg-slate-800/40 rounded-xl font-bold text-sm"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium text-slate-400 ml-1">Size/Type *</Label>
 <Input value={variant.size} onChange={(e) => handleVariantChange(index,"size", e.target.value)} placeholder="e.g. 30ml"required className="h-12 bg-white/60 dark:bg-slate-800/40 rounded-xl font-bold text-sm"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium text-slate-400 ml-1">Price (৳) *</Label>
 <Input type="number"step="0.01"value={variant.price} onChange={(e) => handleVariantChange(index,"price", e.target.value)} placeholder="0.00"required className="h-12 bg-white/60 dark:bg-slate-800/40 rounded-xl font-bold text-sm"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium text-slate-400 ml-1">Stock *</Label>
 <Input type="number"value={variant.stock} onChange={(e) => handleVariantChange(index,"stock", e.target.value)} placeholder="0"required className="h-12 bg-white/60 dark:bg-slate-800/40 rounded-xl font-bold text-sm"/>
 </div>
 </div>

 {/* Variant Images */}
 <div className="pt-4 space-y-4">
 <div className="flex items-center justify-between">
 <Label className="text-sm font-medium text-slate-400 flex items-center gap-2">
 <ImageIcon className="h-3 w-3"/>
 Variant Images
 </Label>
 <Button type="button"variant="outline"size="sm"onClick={() => document.getElementById(`variant-image-${index}`)?.click()} disabled={uploadingVariantIndex === index} className="h-8 rounded-lg text-[9px] font-medium">
 <Upload className="h-3 w-3 mr-2"/>
 {uploadingVariantIndex === index ?"Uploading...":"Add Images"}
 </Button>
 <Input type="file"multiple accept="image/*"onChange={(e) => handleVariantImageUpload(index, e)} className="hidden"id={`variant-image-${index}`} />
 </div>

 {variant.images.length > 0 && (
 <div className="flex flex-wrap gap-4">
 {variant.images.map((img: string, imgIdx: number) => (
 <div key={imgIdx} className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
 <Image src={img} alt={`Variant ${index + 1} Image ${imgIdx + 1}`} fill className="object-contain bg-white/50 dark:bg-slate-800/50"/>
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
 <Button type="button"variant="destructive"size="icon"className="h-8 w-8 rounded-full scale-90 group-hover:scale-100"onClick={() => removeVariantImage(index, imgIdx)}>
 <X className="h-4 w-4"/>
 </Button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 ))
 )}
 </div>
 );
}
