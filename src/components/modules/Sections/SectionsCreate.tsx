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
  FormDescription,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  X,
  Image as ImageIcon,
  Upload,
  Loader2,
  Trash2,
} from "lucide-react";
import { SECTION_TYPE } from "@/types/section.interface";
import { createSection } from "@/action/section/section.action";
import { toast } from "sonner";

// Schema without images field since we're handling files separately
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
          `Invalid file type: ${file.name}. Please upload images only.`
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
          `Invalid file type: ${file.name}. Please upload images only.`
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
          formData.append(key, String(value)); // "true" | "false"
        } else {
          formData.append(key, String(value)); // HERO, PROMOTIONAL, etc
        }
      });

      // Append each image file - multer expects field name "images"
      selectedFiles.forEach((file) => {
        formData.append("images", file); // Important: field name must be "images"
      });

      console.log("📤 Form data entries:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      // Call the action with FormData
      const result = await createSection(formData);
      console.log("createPage", result);
      if (result.success) {
        toast.success("✅ Section created successfully!");
      } else {
        toast.error("❌ Failed to create section. Please try again.");
      }

      // Reset form
      form.reset();
      setSelectedFiles([]);

      router.push("/");
      router.refresh();
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

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          Create Image Section
        </CardTitle>
        <CardDescription>
          Upload images to create a section. Only section type and images are
          required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission
              form.handleSubmit(handleSubmit)(e);
            }}
            className="space-y-8"
          >
            {/* Section Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Section Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select section type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SECTION_TYPE.HERO}>
                        Hero Banner
                      </SelectItem>
                      <SelectItem value={SECTION_TYPE.PROMOTIONAL}>
                        Promotional
                      </SelectItem>
                      <SelectItem value={SECTION_TYPE.BENEFITS}>
                        Benefits
                      </SelectItem>
                      <SelectItem value={SECTION_TYPE.NEW_ARRIVALS}>
                        New Arrivals
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {getTypeDescription(field.value)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Images Section - Required */}
            <div>
              <FormLabel className="text-base flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Images *
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  {selectedFiles.length} image
                  {selectedFiles.length !== 1 ? "s" : ""}
                </span>
              </FormLabel>

              <div className="space-y-4">
                {/* File Upload Area */}
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
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
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Click or drag images to upload
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports JPG, PNG, WebP, GIF, SVG
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Select Images
                  </Button>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Selected Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2">
                            <div className="relative w-full h-full">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <div className="mt-2 space-y-1">
                            <div className="text-xs font-medium truncate">
                              {file.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <FormDescription className="mt-4">
                Upload at least one image. The first image will be used as the
                main display image. Maximum file size: 5MB per image. Supported
                formats: JPG, PNG, WebP, GIF, SVG.
              </FormDescription>
            </div>

            <Separator />

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Optional Settings
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Section title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ctaText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Text (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Button text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Brief description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Hidden submit button for form validation */}
            <button type="submit" style={{ display: "none" }} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button" // Changed to type="button"
          onClick={() => {
            // Validate form first
            form.trigger().then((isValid) => {
              if (isValid && selectedFiles.length > 0) {
                form.handleSubmit(handleSubmit)();
              } else if (selectedFiles.length === 0) {
                toast.error("Please select at least one image");
              }
            });
          }}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              Create Image Section
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
