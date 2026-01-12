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
import { Plus, X, Image as ImageIcon, Save, Eye } from "lucide-react";
import { Section } from "@/types/section.interface";
import { updateSection } from "@/action/section/section.action";
import { toast } from "sonner";

// Simplified update schema
const updateSchema = z.object({
  images: z
    .array(
      z.string().url({
        message: "Please enter a valid URL for each image.",
      })
    )
    .min(1, {
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
  const [newImage, setNewImage] = useState("");

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

      // Only send non-empty fields
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      await updateSection(section.id, formData);

      toast("✅ Section updated!");

      router.refresh();
    } catch (error) {
      toast("❌ Failed to update section. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, newImage.trim()], {
        shouldValidate: true,
      });
      setNewImage("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
      {
        shouldValidate: true,
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddImage();
    }
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
                    {/* Image Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter image URL"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddImage}
                        variant="secondary"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Image
                      </Button>
                    </div>

                    {/* Images Preview Grid */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border">
                              <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23999"><rect width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10">Image</text></svg>';
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
                                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                                  Main
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormDescription>
                    Drag and drop to reorder images. The first image is
                    displayed as primary.
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
