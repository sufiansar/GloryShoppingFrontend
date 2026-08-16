import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogFooter,
} from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import { deleteReview } from"@/action/review/review.action";
import { toast } from"sonner";
import { useState } from"react";

interface ReviewDeleteModalProps {
 isOpen: boolean;
 onClose: () => void;
 review: any;
 onDelete: () => void;
}

export function ReviewDeleteModal({
 isOpen,
 onClose,
 review,
 onDelete,
}: ReviewDeleteModalProps) {
 const [loading, setLoading] = useState(false);

 const handleDelete = async () => {
 setLoading(true);
 try {
 await deleteReview(review.id);
 toast.success("Review deleted successfully");
 onDelete();
 onClose();
 } catch (e: any) {
 toast.error(e.message ||"Failed to delete review");
 } finally {
 setLoading(false);
 }
 };

 if (!review) return null;

 return (
 <Dialog open={isOpen} onOpenChange={onClose}>
 <DialogContent>
 <DialogHeader>
 <DialogTitle>Delete Review</DialogTitle>
 </DialogHeader>
 <div className="py-4">Are you sure you want to delete this review?</div>
 <DialogFooter>
 <Button variant="outline"onClick={onClose} disabled={loading}>
 Cancel
 </Button>
 <Button
 variant="destructive"
 onClick={handleDelete}
 disabled={loading}
 >
 Delete
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 );
}
