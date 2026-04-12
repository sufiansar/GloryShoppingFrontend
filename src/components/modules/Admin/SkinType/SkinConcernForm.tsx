// components/skin-management/SkinConcernForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createSkinConcern,
  updateSkinConcern,
} from "@/action/skinConcerns/skinConcern.action";

interface SkinConcernFormProps {
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    name?: string;
  };
  onSuccess?: () => void;
}

export function SkinConcernForm({
  mode,
  initialData,
  onSuccess,
}: SkinConcernFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        await createSkinConcern({ name });
      } else if (mode === "edit" && initialData?.id) {
        await updateSkinConcern(initialData.id, { name });
      }

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={mode === "create" ? "default" : "outline"}
          className={mode === "create" ? "bg-[#ca428b] hover:bg-[#b8387c] text-white" : ""}
        >
          {mode === "create" ? "Create Skin Concern" : "Edit"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create New Skin Concern"
              : "Edit Skin Concern"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter skin concern name"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
