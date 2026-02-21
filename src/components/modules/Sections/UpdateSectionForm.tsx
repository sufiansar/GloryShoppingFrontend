// components/section/UpdateSectionForm.tsx
"use client";

import React, { useState } from "react";
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
import { Plus, X, Image as ImageIcon, Save, Eye, Upload } from "lucide-react";
import { Section } from "@/types/section.interface";
import { updateSection } from "@/action/section/section.action";
import { toast } from "sonner";
import Image from "next/image";

// Simplified update schema
const updateSchema = z.object({
  images: z.array(z.string()).min(1, {
    message: "At least one image is required.",
  }),
  title: z.string().optional(),
  description: z.string().optional(),
  icons: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
  ctaText: z.string().optional(),
  isVisible: z.boolean(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

interface UpdateSectionFormProps {
  section: Section;
}

export default function UpdateSectionForm({ section }: UpdateSectionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Initialize form with section data
  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      images: section.images || [],
      title: section.title || "",
      description: section.description || "",
      icons: section.icons || "",
      link: section.link || "",
      ctaText: section.ctaText || "",
      isVisible: section.isVisible ?? true,
      primaryColor: section.primaryColor || "",
      secondaryColor: section.secondaryColor || "",
    },
  });

  const images = form.watch("images");

  async function onSubmit(values: z.infer<typeof updateSchema>) {
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Handle existing images
      if (values.images && values.images.length > 0) {
        formData.append("images", JSON.stringify(values.images));
      }

      // Handle new image files
      for (const file of selectedFiles) {
        formData.append("images", file);
      }

      // Send other fields
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && key !== "images") {
          formData.append(key, String(value));
        }
      });

      await updateSection(section.id, formData);

      toast.success("✅ Section updated!");

      router.refresh();
    } catch (error) {
      toast.error("❌ Failed to update section. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      // Create preview URLs for the new files
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, ...newImageUrls], {
        shouldValidate: true,
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images");
    const isNewImage = currentImages[index]?.startsWith("blob:");

    if (isNewImage) {
      // Revoke the blob URL to free memory
      URL.revokeObjectURL(currentImages[index]);
      // Remove from selectedFiles if it's a new file
      setSelectedFiles((prev) =>
        prev.filter(
          (_, i) => i !== index - (images.length - selectedFiles.length),
        ),
      );
    }

    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
      {
        shouldValidate: true,
      },
    );
  };

  const handleRemoveAllNewImages = () => {
    // Revoke all blob URLs
    images.forEach((image, index) => {
      if (image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    });
    setSelectedFiles([]);
    // Keep only existing images (non-blob URLs)
    const existingImages = images.filter((img) => !img.startsWith("blob:"));
    form.setValue("images", existingImages);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ImageIcon className="h-6 w-6" />
              Edit {section.type.toLowerCase().replace("_", " ")} Section
            </CardTitle>
            <CardDescription>
              Update images and optional settings for this section
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">{section.type}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Images Section - Required */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Images *
                    </div>
                    <span className="text-sm font-normal text-muted-foreground">
                      {images.length} image{images.length !== 1 ? "s" : ""}
                    </span>
                  </FormLabel>

                  <div className="space-y-4">
                    {/* Image Upload Area */}
                    <div className="flex flex-col items-center justify-center w-full">
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or WEBP (MAX. 5MB each)
                          </p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>

                    {/* Selected Files Info */}
                    {selectedFiles.length > 0 && (
                      <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                        <span className="text-sm text-muted-foreground">
                          {selectedFiles.length} new file
                          {selectedFiles.length !== 1 ? "s" : ""} selected
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveAllNewImages}
                          className="h-8 text-destructive hover:text-destructive"
                        >
                          Remove all
                        </Button>
                      </div>
                    )}

                    {/* Images Preview Grid */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                              <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23999"><rect width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10">Error</text></svg>';
                                }}
                              />
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {index === 0 && (
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded shadow-sm">
                                  Main
                                </span>
                              </div>
                            )}
                            {image.startsWith("blob:") && (
                              <div className="absolute bottom-2 left-2">
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded shadow-sm">
                                  New
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormDescription>
                    Upload new images or remove existing ones. The first image
                    will be displayed as primary.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Optional Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional title" {...field} />
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
                      <FormLabel>CTA Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional button text" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Optional description"
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
                    <FormLabel>Link URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional link URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
