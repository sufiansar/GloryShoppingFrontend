// components/skin-management/SkinTypeForm.tsx
"use client";

import { useState } from"react";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Label } from"@/components/ui/label";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from"@/components/ui/dialog";
import { createSkinType, updateSkinType } from"@/action/skinType/skin.action";

interface SkinTypeFormProps {
 mode:"create"|"edit";
 initialData?: any;
 onSuccess?: () => void;
}

export function SkinTypeForm({
 mode,
 initialData,
 onSuccess,
}: SkinTypeFormProps) {
 const [open, setOpen] = useState(false);
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
 name: initialData?.name ||"",
 description: initialData?.description ||"",
 imageUrl: initialData?.imageUrl ||"",
 });

 const handleChange = (
 e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
 ) => {
 const { name, value } = e.target;
 setFormData((prev) => ({ ...prev, [name]: value }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);

 try {
 if (mode ==="create") {
 await createSkinType(JSON.stringify(formData));
 } else if (mode ==="edit"&& initialData?.id) {
 await updateSkinType(initialData.id, formData);
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
 variant={mode ==="create"?"default":"outline"}
 className={mode ==="create"?"bg-[#ca428b] hover:bg-[#b8387c] text-white":""}
 >
 {mode ==="create"?"Create Skin Type":"Edit"}
 </Button>
 </DialogTrigger>
 <DialogContent className="sm:max-w-125">
 <DialogHeader>
 <DialogTitle>
 {mode ==="create"?"Create New Skin Type":"Edit Skin Type"}
 </DialogTitle>
 </DialogHeader>
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="space-y-2">
 <Label htmlFor="name">Name</Label>
 <Input
 id="name"
 name="name"
 value={formData.name}
 onChange={handleChange}
 required
 placeholder="Enter skin type name"
 />
 </div>

 <div className="flex justify-end space-x-2">
 <Button
 type="button"
 variant="outline"
 onClick={() => setOpen(false)}
 >
 Cancel
 </Button>
 <Button type="submit"disabled={loading}>
 {loading ?"Saving...": mode ==="create"?"Create":"Update"}
 </Button>
 </div>
 </form>
 </DialogContent>
 </Dialog>
 );
}
