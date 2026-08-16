// components/admin/reviews/edit-review-modal.tsx
"use client";

import { useState } from"react";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
} from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Textarea } from"@/components/ui/textarea";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";
import { updateReview } from"@/action/review/review.action";
import { toast } from"sonner";

interface EditReviewModalProps {
 isOpen: boolean;
 onClose: () => void;
 review: any | null;
 onUpdate: (updatedReview: any) => void;
}

export function EditReviewModal({
 isOpen,
 onClose,
 review,
 onUpdate,
}: EditReviewModalProps) {
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
 rating: review?.rating || 5,
 title: review?.title ||"",
 comment: review?.comment ||"",
 status: review?.status ||"pending",
 });

 if (!review) return null;

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);

 try {
 const updated = await updateReview(review.id, formData);
 onUpdate(updated);
 toast.success("Review updated successfully");
 onClose();
 } catch (error) {
 toast.error("Failed to update review. Please try again.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <Dialog open={isOpen} onOpenChange={onClose}>
 <DialogContent className="max-w-2xl">
 <DialogHeader>
 <DialogTitle>Edit Review</DialogTitle>
 </DialogHeader>
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="space-y-2">
 <Label htmlFor="rating">Rating</Label>
 <Select
 value={formData.rating.toString()}
 onValueChange={(value) =>
 setFormData({ ...formData, rating: parseInt(value) })
 }
 >
 <SelectTrigger>
 <SelectValue placeholder="Select rating"/>
 </SelectTrigger>
 <SelectContent>
 {[5, 4, 3, 2, 1].map((rating) => (
 <SelectItem key={rating} value={rating.toString()}>
 {rating} Star{rating !== 1 ?"s":""}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 <div className="space-y-2">
 <Label htmlFor="title">Title (Optional)</Label>
 <Input
 id="title"
 value={formData.title}
 onChange={(e) =>
 setFormData({ ...formData, title: e.target.value })
 }
 placeholder="Review title"
 />
 </div>

 <div className="space-y-2">
 <Label htmlFor="comment">Comment</Label>
 <Textarea
 id="comment"
 value={formData.comment}
 onChange={(e) =>
 setFormData({ ...formData, comment: e.target.value })
 }
 placeholder="Review comment"
 rows={5}
 required
 />
 </div>

 <div className="space-y-2">
 <Label htmlFor="status">Status</Label>
 <Select
 value={formData.status}
 onValueChange={(value) =>
 setFormData({ ...formData, status: value })
 }
 >
 <SelectTrigger>
 <SelectValue placeholder="Select status"/>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="published">Published</SelectItem>
 <SelectItem value="pending">Pending</SelectItem>
 <SelectItem value="hidden">Hidden</SelectItem>
 </SelectContent>
 </Select>
 </div>

 <div className="flex justify-end gap-2 pt-4">
 <Button type="button"variant="outline"onClick={onClose}>
 Cancel
 </Button>
 <Button type="submit"disabled={loading}>
 {loading ?"Updating...":"Update Review"}
 </Button>
 </div>
 </form>
 </DialogContent>
 </Dialog>
 );
}
