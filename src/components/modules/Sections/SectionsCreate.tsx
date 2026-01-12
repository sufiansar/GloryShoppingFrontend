// components/section/CreateSectionForm.tsx
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
import { Plus, X, Image as ImageIcon, Upload } from "lucide-react";
import { SECTION_TYPE } from "@/types/section.interface";
import { createSection } from "@/action/section/section.action";
import { toast } from "sonner";

const createSchema = z.object({
  type: z.nativeEnum(SECTION_TYPE),
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

export default function CreateSectionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newImage, setNewImage] = useState("");

  // Initialize form
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      type: SECTION_TYPE.HERO,
      images: [],
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

  const images = form.watch("images");
  const type = form.watch("type");

  // Handle form submission
  async function onSubmit(values: z.infer<typeof createSchema>) {
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Only send non-empty optional fields
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      await createSection(formData);

      toast.success(
        "✅ Section created! Your image section has been created successfully."
      );

      router.push("/sections");
      router.refresh();
    } catch (error) {
      toast.error("❌ Failed to create section. Please try again.");
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          Create Image Section
        </CardTitle>
        <CardDescription>
          Create a section that displays images. Only section type and images
          are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Section Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select section type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SECTION_TYPE.HERO}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600">🏆</span>
                          </div>
                          <div>
                            <div className="font-medium">Hero Banner</div>
                            <div className="text-xs text-muted-foreground">
                              Main banner for homepage
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value={SECTION_TYPE.PROMOTIONAL}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-red-100 flex items-center justify-center">
                            <span className="text-red-600">🎁</span>
                          </div>
                          <div>
                            <div className="font-medium">Promotional</div>
                            <div className="text-xs text-muted-foreground">
                              Special offers and discounts
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value={SECTION_TYPE.BENEFITS}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-green-100 flex items-center justify-center">
                            <span className="text-green-600">✨</span>
                          </div>
                          <div>
                            <div className="font-medium">Benefits</div>
                            <div className="text-xs text-muted-foreground">
                              Features and advantages
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value={SECTION_TYPE.NEW_ARRIVALS}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600">🆕</span>
                          </div>
                          <div>
                            <div className="font-medium">New Arrivals</div>
                            <div className="text-xs text-muted-foreground">
                              Latest products and items
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>{getTypeDescription(type)}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Images Section - Required */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
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
                        placeholder="Enter image URL (https://example.com/image.jpg)"
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
                        Add
                      </Button>
                    </div>

                    {/* Images Preview Grid */}
                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2">
                              <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
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
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-12 text-center">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">
                          No images added yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add at least one image to create the section
                        </p>
                      </div>
                    )}
                  </div>

                  <FormDescription>
                    Add image URLs. The first image will be used as the main
                    display image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Optional Fields (Collapsible) */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Optional Settings (Click to expand)
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
          disabled={isLoading || images.length === 0}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
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
