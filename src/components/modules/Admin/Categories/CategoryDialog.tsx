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
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { updateCategoriesAction } from "@/action/categories/categories.action";
import { Category } from "@/types/categories.interface";
import { toast } from "sonner";

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

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    }
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

      if (category.images && category.images.length > 0) {
        formDataObj.append("images", JSON.stringify(category.images));
      }

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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isVisible: checked }));
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

            {mode === "view" &&
              category?.images &&
              category.images.length > 0 && (
                <div className="grid gap-2">
                  <Label>Images</Label>
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
