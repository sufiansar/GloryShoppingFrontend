"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Brand } from "@/types/brand.interface";
import { createBrand, updateBrand } from "@/action/brand/brand.action";
import { toast } from "sonner";

interface BrandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean, refresh?: boolean) => void;
  brand?: Brand | null;
  mode: "view" | "edit" | "create";
  trigger?: React.ReactNode;
}

export default function BrandDialog({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  brand,
  mode,
  trigger,
}: BrandDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    country: "",
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled
    ? externalOnOpenChange || (() => {})
    : (open: boolean, refresh = false) => {
        setInternalOpen(open);
        if (refresh) router.refresh();
      };

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        slug: brand.slug || "",
        country: brand.country || "",
        logoUrl: brand.logoUrl || "",
      });
      if (brand.logoUrl) {
        setLogoPreview(brand.logoUrl);
      }
    } else if (mode === "create") {
      setFormData({
        name: "",
        slug: "",
        country: "",
        logoUrl: "",
      });
      setLogoPreview(null);
      setLogoFile(null);
    }
  }, [brand, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "view") {
      setOpen(false, false);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("slug", formData.slug);
      if (formData.country) {
        formDataObj.append("country", formData.country);
      }

      // Handle logo file
      if (logoFile) {
        formDataObj.append("logo", logoFile);
      } else if (formData.logoUrl) {
        formDataObj.append("logoUrl", JSON.stringify([formData.logoUrl]));
      }

      let result;
      if (mode === "create") {
        result = await createBrand(formDataObj);
      } else if (mode === "edit" && brand) {
        result = await updateBrand(brand.id, formDataObj);
      }

      if (result?.success || result?.data?.id) {
        toast.success(`Brand ${mode === "create" ? "created" : "updated"} successfully`);
        setOpen(false, true);
      } else {
        toast.error(result?.message || `Failed to ${mode} brand`);
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      setError(error instanceof Error ? error.message : "Failed to save brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setFormData((prev) => ({ ...prev, logoUrl: "" }));
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case "view":
        return "View Brand";
      case "edit":
        return "Edit Brand";
      case "create":
        return "Add New Brand";
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogDescription>
          {mode === "view"
            ? "View brand details"
            : mode === "edit"
              ? "Make changes to the brand here"
              : "Add a new brand to your store"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          {/* Logo Upload */}
          <div className="grid gap-2">
            <Label htmlFor="logo">Brand Logo</Label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <div className="relative w-20 h-20">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-contain rounded border"
                  />
                  {mode !== "view" && (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}

              {mode !== "view" && (
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {logoPreview ? "Change Logo" : "Upload Logo"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 200x200px PNG or JPG
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Brand Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={mode === "view"}
              placeholder="Enter brand name"
              required
            />
          </div>

          {/* Slug */}
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              disabled={mode === "view"}
              placeholder="brand-slug (auto-generated if empty)"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version of the name
            </p>
          </div>

          {/* Country */}
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={mode === "view"}
              placeholder="Enter country of origin"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false, false)}
            disabled={isSubmitting}
          >
            {mode === "view" ? "Close" : "Cancel"}
          </Button>
          {mode !== "view" && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Create Brand"}
            </Button>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={(open) => setOpen(open, false)}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open, false)}>
      {dialogContent}
    </Dialog>
  );
}
