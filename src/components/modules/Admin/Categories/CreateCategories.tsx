"use client";

import { useState } from"react";
import { useRouter } from"next/navigation";
import { zodResolver } from"@hookform/resolvers/zod";
import { useForm } from"react-hook-form";
import { z } from"zod";
import { Button } from"@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from"@/components/ui/form";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { AlertCircle, CheckCircle2, FolderPlus, ImageIcon, Loader2, Upload, X } from"lucide-react";
import { createCategoriesAction } from"@/action/categories/categories.action";
import { toast } from"sonner";
import { cn } from"@/lib/utils";

// Define the form schema
const formSchema = z.object({
 name: z.string().min(2, {
 message:"Category name must be at least 2 characters.",
 }),
 description: z.string().optional(),
 images: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCategoryFormProps {
 onSuccess?: () => void;
}

export function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
 const router = useRouter();
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [imageFiles, setImageFiles] = useState<File[]>([]);

 const form = useForm<FormValues>({
 resolver: zodResolver(formSchema),
 defaultValues: {
 name:"",
 description:"",
 images: [],
 },
 });

 async function onSubmit(values: FormValues) {
 setIsLoading(true);
 setError(null);

 try {
 const data = new FormData();
 data.append("name", values.name);
 if (values.description) {
 data.append("description", values.description);
 }
 imageFiles.forEach((file) => {
 data.append("images", file);
 });

 const result = await createCategoriesAction(data);
 if (result.success) {
 toast.success("✅ Category created successfully!");
 form.reset();
 setImageFiles([]);
 if (onSuccess) onSuccess();
 } else {
 toast.error("❌ Failed to create category.");
 }
 } catch (err) {
 setError(err instanceof Error ? err.message :"An error occurred");
 } finally {
 setIsLoading(false);
 }
 }

 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const files = Array.from(e.target.files || []);
 setImageFiles((prev) => [...prev, ...files]);
 };

 const removeImage = (index: number) => {
 setImageFiles((prev) => prev.filter((_, i) => i !== index));
 };

 return (
 <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
 {/* Decorative Background Blob */}
 <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-custom/10 rounded-full blur-3xl pointer-events-none"/>
 
 <div className="relative z-10">
 <div className="flex items-center gap-4 mb-10">
 <div className="h-14 w-14 rounded-2xl bg-primary-custom/10 dark:bg-primary-custom/20 flex items-center justify-center border border-primary-custom/20 shadow-inner">
 <FolderPlus className="h-7 w-7 text-primary-custom"/>
 </div>
 <div>
 <h1 className="text-3xl font-medium text-slate-900 dark:text-white">Create New Category</h1>
 <p className="text-sm font-medium text-slate-400 -mt-1">Define Product Taxonomy</p>
 </div>
 </div>

 {error && (
 <div className="mb-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
 <AlertCircle className="h-5 w-5 text-rose-500 shrink-0"/>
 <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 tracking-wide leading-tight">{error}</p>
 </div>
 )}

 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
 <div className="space-y-6">
 <FormField
 control={form.control}
 name="name"
 render={({ field }) => (
 <FormItem className="space-y-2">
 <FormLabel className="text-sm font-medium text-slate-400 ml-1">Category Name *</FormLabel>
 <FormControl>
 <Input
 placeholder="Enter category name"
 {...field}
 disabled={isLoading}
 className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
 />
 </FormControl>
 <p className="text-sm font-bold text-slate-400 ml-1 er opacity-70">
 This will be used to generate the URL slug
 </p>
 <FormMessage className="text-sm font-medium text-rose-500 ml-1"/>
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="description"
 render={({ field }) => (
 <FormItem className="space-y-2">
 <FormLabel className="text-sm font-medium text-slate-400 ml-1">Description</FormLabel>
 <FormControl>
 <Textarea
 placeholder="Enter category description"
 className="min-h-[120px] bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300 resize-none"
 {...field}
 disabled={isLoading}
 value={field.value ||""}
 />
 </FormControl>
 <p className="text-sm font-bold text-slate-400 ml-1 er opacity-70">
 Optional description for the category
 </p>
 <FormMessage className="text-sm font-medium text-rose-500 ml-1"/>
 </FormItem>
 )}
 />

 <div className="space-y-4 pt-2">
 <div className="flex items-center justify-between px-1">
 <div className="flex items-center gap-2">
 <ImageIcon className="h-4 w-4 text-primary-custom"/>
 <FormLabel className="text-sm font-medium text-slate-400 m-0">Images</FormLabel>
 </div>
 <span className="text-sm font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
 {imageFiles.length} file(s) selected
 </span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 <label
 htmlFor="image-upload"
 className={cn(
"aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group relative overflow-hidden bg-slate-50/30 dark:bg-slate-900/30",
 isLoading
 ?"border-slate-100 cursor-not-allowed"
 :"border-slate-200 dark:border-slate-800 hover:border-primary-custom hover:bg-white dark:hover:bg-slate-800/50"
 )}
 >
 <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 z-10">
 <Upload className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-primary-custom"/>
 </div>
 <span className="text-sm font-medium text-slate-400 mt-3 group-hover:text-slate-600 dark:group-hover:text-slate-300 z-10">Upload Image</span>
 <input
 id="image-upload"
 type="file"
 accept="image/*"
 multiple
 className="hidden"
 onChange={handleImageUpload}
 disabled={isLoading}
 />
 </label>

 {imageFiles.map((file, index) => (
 <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 ring-4 ring-white/30 transition-transform duration-500 hover:scale-[1.02]">
 <img
 src={URL.createObjectURL(file)}
 alt={`Preview ${index + 1}`}
 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
 />
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
 <button
 type="button"
 onClick={() => removeImage(index)}
 className="h-10 w-10 rounded-full bg-rose-500 text-white shadow-lg scale-90 group-hover:scale-100 transition-transform flex items-center justify-center hover:bg-rose-600"
 disabled={isLoading}
 >
 <X className="h-5 w-5"/>
 </button>
 </div>
 </div>
 ))}
 </div>
 <div className="flex items-center gap-2 px-1 opacity-60">
 <div className="h-1 w-1 rounded-full bg-slate-400"/>
 <p className="text-[9px] font-bold text-slate-400 er">
 Supported formats: JPEG, PNG, WebP. Max file size: 5MB
 </p>
 </div>
 </div>
 </div>

 <div className="flex items-center justify-end gap-6 pt-8 border-t border-white/20 dark:border-slate-800/50">
 <Button
 type="button"
 variant="ghost"
 onClick={() => router.back()}
 disabled={isLoading}
 className="rounded-xl h-12 px-6 text-sm font-medium text-slate-400 hover:text-slate-900 transition-all active:scale-95"
 >
 Cancel
 </Button>
 <Button 
 type="submit"
 disabled={isLoading}
 className="rounded-2xl h-14 min-w-[220px] px-10 bg-primary-custom text-white font-medium text-sm shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all active:scale-[0.98] disabled:opacity-50 border-none"
 >
 {isLoading ? (
 <div className="flex items-center gap-2">
 <Loader2 className="h-4 w-4 animate-spin"/>
 Processing...
 </div>
 ) : (
 <div className="flex items-center gap-2">
 <CheckCircle2 className="h-4 w-4"/>
 Create Category
 </div>
 )}
 </Button>
 </div>
 </form>
 </Form>
 </div>
 </div>
 </div>
 );
}
