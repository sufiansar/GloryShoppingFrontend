"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { updateCategoriesAction } from "@/action/categories/categories.action";
import { Category } from "@/types/categories.interface";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, refresh?: boolean) => void;
  category: Category | null;
  mode: "view" | "edit";
}

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
  mode,
}: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    }
    // Reset new images on open
    setNewImageFiles([]);
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "view" || !category) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);

      // Attach any newly selected image files
      newImageFiles.forEach((file) => {
        formDataObj.append("images", file);
      });

      const result = await updateCategoriesAction(category?.id!, formDataObj);

      if (result?.success || result?.data?.id) {
        toast.success("Category updated successfully");
        onOpenChange(false, true);
      } else {
        toast.error(result?.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update category",
      );
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImageFiles((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getDialogTitle = () => {
    return mode === "view" ? "View Category" : "Edit Category";
  };

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "View category details"
              : "Make changes to the category here"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={mode === "view"}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={mode === "view"}
                placeholder="Enter category description"
                rows={4}
              />
            </div>

            {/* Images section - view mode shows existing, edit mode allows upload */}
            {category?.images && category.images.length > 0 && (
              <div className="grid gap-2">
                <Label>Current Images</Label>
                <div className="grid grid-cols-3 gap-2">
                  {category.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-md border"
                    >
                      <img
                        src={typeof image === "string" ? image : image.url}
                        alt={`${category.name} ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === "edit" && (
              <div className="grid gap-2">
                <Label>Add New Images</Label>
                <label
                  htmlFor="edit-image-upload"
                  className="flex items-center gap-2 border-2 border-dashed border-slate-200 rounded-lg p-3 cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">Click to upload images</span>
                  <input
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isSubmitting}
                  />
                </label>
                {newImageFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {newImageFiles.map((file, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-md border group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {mode === "edit" && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
