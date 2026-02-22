import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { updateReview } from "@/action/review/review.action";
import { toast } from "sonner";

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: any;
  onSave: (updated: any) => void;
}

export function ReviewEditModal({
  isOpen,
  onClose,
  review,
  onSave,
}: ReviewEditModalProps) {
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await updateReview(review.id, { rating, comment });
      toast.success("Review updated successfully");
      onSave(updated);
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            placeholder="Rating (1-5)"
          />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
