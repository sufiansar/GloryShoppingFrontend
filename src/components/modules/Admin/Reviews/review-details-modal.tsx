// components/admin/reviews/review-details-modal.tsx
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
} from"@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from"@/components/ui/avatar";
import { Badge } from"@/components/ui/badge";
import { Star } from"lucide-react";
import { formatDate } from"date-fns";

interface ReviewDetailsModalProps {
 isOpen: boolean;
 onClose: () => void;
 review: any | null;
}

export function ReviewDetailsModal({
 isOpen,
 onClose,
 review,
}: ReviewDetailsModalProps) {
 if (!review) return null;

 const getRatingStars = (rating: number) => {
 return (
 <div className="flex items-center gap-0.5">
 {[1, 2, 3, 4, 5].map((star) => (
 <Star
 key={star}
 className={`h-5 w-5 ${
 star <= rating
 ?"fill-yellow-400 text-yellow-400"
 :"fill-gray-200 text-gray-200"
 }`}
 />
 ))}
 </div>
 );
 };

 return (
 <Dialog open={isOpen} onOpenChange={onClose}>
 <DialogContent className="max-w-2xl">
 <DialogHeader>
 <DialogTitle>Review Details</DialogTitle>
 </DialogHeader>
 <div className="space-y-6">
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-3">
 <Avatar className="h-12 w-12">
 <AvatarImage src={review.user.avatar} />
 <AvatarFallback>
 {review.user.name.charAt(0).toUpperCase()}
 </AvatarFallback>
 </Avatar>
 <div>
 <h3 className="font-semibold">{review.user.name}</h3>
 <p className="text-sm text-muted-foreground">
 {review.user.email}
 </p>
 </div>
 </div>
 <Badge
 variant="outline"
 className={
 review.status ==="published"
 ?"bg-green-100 text-green-800"
 : review.status ==="pending"
 ?"bg-yellow-100 text-yellow-800"
 :"bg-gray-100 text-gray-800"
 }
 >
 {review.status}
 </Badge>
 </div>

 <div className="border-t pt-4">
 <h4 className="font-medium mb-2">Product</h4>
 <div className="flex items-center gap-3">
 {review.product.image && (
 <img
 src={review.product.image}
 alt={review.product.name}
 className="h-16 w-16 rounded-md object-cover"
 />
 )}
 <div>
 <p className="font-medium">{review.product.name}</p>
 <p className="text-sm text-muted-foreground">
 ID: {review.product.id}
 </p>
 </div>
 </div>
 </div>

 <div className="border-t pt-4">
 <h4 className="font-medium mb-2">Rating</h4>
 {getRatingStars(review.rating)}
 </div>

 {review.title && (
 <div className="border-t pt-4">
 <h4 className="font-medium mb-2">Title</h4>
 <p>{review.title}</p>
 </div>
 )}

 <div className="border-t pt-4">
 <h4 className="font-medium mb-2">Comment</h4>
 <p className="text-muted-foreground whitespace-pre-wrap">
 {review.comment}
 </p>
 </div>

 <div className="border-t pt-4 grid grid-cols-2 gap-4">
 <div>
 <h4 className="text-sm font-medium text-muted-foreground">
 Created At
 </h4>
 <p>{formatDate(new Date(review.createdAt),"PPP p")}</p>
 </div>
 <div>
 <h4 className="text-sm font-medium text-muted-foreground">
 Last Updated
 </h4>
 <p>{formatDate(review.updatedAt,"PPP p")}</p>
 </div>
 </div>
 </div>
 </DialogContent>
 </Dialog>
 );
}
