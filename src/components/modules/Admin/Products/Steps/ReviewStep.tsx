import { CheckCircle2, AlertCircle } from"lucide-react";
import Image from"next/image";

interface ReviewStepProps {
 formData: any;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
 // Check for critical missing fields
 const missingFields = [];
 if (!formData.name) missingFields.push("Product Name");
 if (!formData.price) missingFields.push("Base Price");
 if (!formData.brandId) missingFields.push("Brand");
 if (!formData.categoryId) missingFields.push("Category");
 
 const isReady = missingFields.length === 0;

 return (
 <div className="space-y-8 animate-in fade-in duration-500">
 {!isReady && (
 <div className="bg-rose-500 text-white px-8 py-5 rounded-[2rem] shadow-xl shadow-rose-500/20 flex items-center gap-4">
 <AlertCircle className="h-6 w-6 shrink-0"/>
 <div>
 <p className="text-sm font-medium text-white/70 leading-none mb-1">Missing Information</p>
 <p className="text-sm font-medium">Please go back and fill: {missingFields.join(",")}</p>
 </div>
 </div>
 )}

 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
 <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
 <div className="h-10 w-10 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center border border-green-500/20">
 <CheckCircle2 className="h-5 w-5 text-green-500"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">Final Review</h2>
 <p className="text-sm font-medium text-slate-400 -mt-1">Confirm your product details</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-6">
 <div>
 <p className="text-sm font-medium text-slate-400 mb-1">Product Details</p>
 <h3 className="text-lg font-medium text-slate-900 dark:text-white">{formData.name ||"Unnamed Product"}</h3>
 <p className="text-sm text-slate-500">{formData.shortDesc ||"No short description provided."}</p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl">
 <p className="text-sm font-medium text-slate-400 mb-1">Base Price</p>
 <p className="text-lg font-medium text-emerald-500">৳{formData.price ||"0.00"}</p>
 </div>
 <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl">
 <p className="text-sm font-medium text-slate-400 mb-1">Stock</p>
 <p className="text-lg font-medium text-slate-900 dark:text-white">{formData.stock ||"0"}</p>
 </div>
 </div>

 <div className="space-y-2">
 <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
 <span className="text-sm font-bold text-slate-500">Brand</span>
 <span className="text-sm font-medium text-slate-900 dark:text-white">{formData.brandId ?"Selected":"None"}</span>
 </div>
 <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
 <span className="text-sm font-bold text-slate-500">Category</span>
 <span className="text-sm font-medium text-slate-900 dark:text-white">{formData.categoryId ?"Selected":"None"}</span>
 </div>
 <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
 <span className="text-sm font-bold text-slate-500">Variants</span>
 <span className="text-sm font-medium text-slate-900 dark:text-white">{formData.variants?.length || 0}</span>
 </div>
 <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
 <span className="text-sm font-bold text-slate-500">Status</span>
 <span className="text-sm font-medium text-slate-900 dark:text-white">{formData.isActive ?"Active":"Inactive"}</span>
 </div>
 </div>
 </div>

 <div>
 <p className="text-sm font-medium text-slate-400 mb-2">Main Image</p>
 {formData.thumbleImage ? (
 <div className="relative w-full h-64 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700">
 <Image src={formData.thumbleImage} alt="Thumbnail preview"fill className="object-contain bg-white dark:bg-slate-950"/>
 </div>
 ) : (
 <div className="w-full h-64 rounded-[2rem] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
 <p className="text-sm font-bold text-slate-400">No Image Uploaded</p>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
