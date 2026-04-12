// components/section/CreateSectionForm.tsx
"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  X,
  Image as ImageIcon,
  Upload,
  Loader2,
  Trash2,
  LayoutGrid,
  Settings2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { SECTION_TYPE } from "@/types/section.interface";
import { createSection } from "@/action/section/section.action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const createSchema = z.object({
  type: z.nativeEnum(SECTION_TYPE),
  title: z.string().optional(),
  description: z.string().optional(),
  icons: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
  ctaText: z.string().optional(),
  isVisible: z.boolean().default(true).optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

export default function CreateSectionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      type: SECTION_TYPE.HERO,
      title: "",
      description: "",
      icons: "",
      link: "",
      ctaText: "",
      isVisible: true,
      primaryColor: "",
      secondaryColor: "",
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    const validFiles = newFiles.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error(
          `Invalid file type: ${file.name}. Please upload images only.`,
        );
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }

      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);

    const validFiles = files.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error(
          `Invalid file type: ${file.name}. Please upload images only.`,
        );
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }

      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleSubmit = async (values: z.infer<typeof createSchema>) => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === "") return;

        if (key === "isVisible") {
          formData.append(key, String(value));
        } else {
          formData.append(key, String(value));
        }
      });

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const result = await createSection(formData);
      if (result.success) {
        toast.success("✅ Section created successfully!");
        form.reset();
        setSelectedFiles([]);
        router.push("/");
        router.refresh();
      } else {
        toast.error("❌ Failed to create section. Please try again.");
      }
    } catch (error) {
      console.error("Error creating section:", error);
      toast.error("❌ Failed to create section. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeDescription = (type: SECTION_TYPE) => {
    switch (type) {
      case SECTION_TYPE.HERO:
        return "Main banner section for the homepage";
      case SECTION_TYPE.PROMOTIONAL:
        return "Promotional banners and special offers";
      case SECTION_TYPE.BENEFITS:
        return "Showcase benefits or features";
      case SECTION_TYPE.NEW_ARRIVALS:
        return "Display new products or arrivals";
      default:
        return "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-14 w-14 rounded-2xl bg-primary-custom/10 dark:bg-primary-custom/20 flex items-center justify-center border border-primary-custom/20 shadow-inner">
              <LayoutGrid className="h-7 w-7 text-primary-custom" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Create Image Section</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">
                Upload images to create a section. Only section type and images are required.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(handleSubmit)(e);
              }}
              className="space-y-10"
            >
              {/* Section Type Panel */}
              <div className="bg-white/40 dark:bg-slate-800/20 p-6 rounded-3xl border border-white/40 dark:border-slate-800/50">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Settings2 className="h-4 w-4 text-primary-custom" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Type *</FormLabel>
                      </div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus:ring-primary-custom/30 font-bold transition-all duration-300">
                            <SelectValue placeholder="Select section type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
                          <SelectItem value={SECTION_TYPE.HERO} className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Hero Banner</SelectItem>
                          <SelectItem value={SECTION_TYPE.PROMOTIONAL} className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Promotional</SelectItem>
                          <SelectItem value={SECTION_TYPE.BENEFITS} className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Benefits</SelectItem>
                          <SelectItem value={SECTION_TYPE.NEW_ARRIVALS} className="rounded-xl font-bold uppercase text-[10px] tracking-widest">New Arrivals</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2 px-1">
                        <Info className="h-3 w-3 text-primary-custom/60" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-70">
                          {getTypeDescription(field.value)}
                        </p>
                      </div>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images Selection Panel */}
              <div className="bg-white/40 dark:bg-slate-800/20 p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary-custom" />
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 m-0">Images *</FormLabel>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                    {selectedFiles.length} image{selectedFiles.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* High-End Drop Zone */}
                  <div
                    className="group relative overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-primary-custom transition-all duration-500 bg-slate-50/30 dark:bg-slate-900/30"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="h-20 w-20 rounded-[1.75rem] bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-slate-100 dark:border-slate-700">
                        <Upload className="h-10 w-10 text-slate-300 dark:text-slate-600 group-hover:text-primary-custom" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 mb-1 group-hover:text-primary-custom transition-colors">Click or drag images to upload</p>
                        <p className="text-[9px] font-bold text-slate-400 opacity-70 uppercase tracking-tighter">
                          JPG, PNG, WEBP, GIF, SVG (MAX 5MB PER IMAGE)
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl h-10 px-6 bg-primary-custom/10 text-primary-custom font-black uppercase tracking-widest text-[9px] hover:bg-primary-custom/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-2" />
                        Select Images
                      </Button>
                    </div>
                  </div>

                  {/* Polished Previews Grid */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-4 pt-4 animate-in fade-in duration-500">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Selected Assets</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200/50 ring-4 ring-white/30 transition-transform duration-500 hover:scale-[1.05] hover:z-20">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] p-2">
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="h-10 w-10 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform mb-2"
                                onClick={() => handleRemoveFile(index)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                              <p className="text-[8px] font-black text-white uppercase tracking-tighter text-center line-clamp-1">{file.name}</p>
                              <p className="text-[8px] font-bold text-white/70 uppercase tracking-tighter">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 px-2 opacity-60 bg-slate-900/5 dark:bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight leading-relaxed">
                    Upload at least one image. The first image will be used as the main display image. Maximum file size: 5MB per image.
                  </p>
                </div>
              </div>

              {/* Optional Settings Panel */}
              <div className="bg-white/40 dark:bg-slate-800/20 p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 space-y-8">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Plus className="h-4 w-4 text-indigo-500" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Optional Settings
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Section title" 
                            {...field} 
                            className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ctaText"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">CTA Text (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Button text" 
                            {...field} 
                            className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description (Optional)</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[100px] w-full rounded-2xl border border-white/20 dark:border-slate-800/50 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md px-4 py-3 text-sm font-bold shadow-inner placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-custom/30 transition-all duration-300 resize-none"
                          placeholder="Brief description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Link URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com" 
                          {...field} 
                          className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Global Post Action Area */}
              <div className="sticky bottom-0 left-0 right-0 z-50 pt-10 pb-2">
                <div className="bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/40 dark:border-slate-800/50 shadow-2xl flex items-center justify-between gap-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="rounded-2xl h-14 px-8 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
                  >
                    Cancel Session
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      form.trigger().then((isValid) => {
                        if (isValid && selectedFiles.length > 0) {
                          form.handleSubmit(handleSubmit)();
                        } else if (selectedFiles.length === 0) {
                          toast.error("Please select at least one image");
                        }
                      });
                    }}
                    disabled={isLoading}
                    className="rounded-[1.5rem] h-14 min-w-[280px] px-10 bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Committing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Create Image Section
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {/* Hidden submit button for form validation */}
              <button type="submit" style={{ display: "none" }} />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
