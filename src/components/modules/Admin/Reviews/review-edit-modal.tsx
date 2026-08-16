import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogFooter,
 DialogDescription
} from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { useState, useEffect } from"react";
import { updateReview } from"@/action/review/review.action";
import { toast } from"sonner";
import { Star, Save, X, Edit3, MessageSquare, AlertCircle } from"lucide-react";
import { Separator } from"@/components/ui/separator";

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
 const [rating, setRating] = useState(0);
 const [comment, setComment] = useState("");
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 if (review) {
 setRating(review.rating || 0);
 setComment(review.comment ||"");
 }
 }, [review]);

 const handleSave = async () => {
 if (rating < 1 || rating > 5) {
 toast.error("Rating must be between 1 and 5");
 return;
 }
 setLoading(true);
 try {
 const updated = await updateReview(review.id, { rating, comment });
 toast.success("Review updated successfully");
 onSave(updated);
 onClose();
 } catch (e: any) {
 toast.error(e.message ||"Failed to update review");
 } finally {
 setLoading(false);
 }
 };

 if (!review) return null;

 return (
 <Dialog open={isOpen} onOpenChange={onClose}>
 <DialogContent className="max-w-2xl p-0 overflow-hidden premium-glass-dialog border-none rounded-[3rem]">
 <div className="p-10 space-y-8">
 <DialogHeader className="space-y-1">
 <div className="flex items-center gap-2 mb-2">
 <Edit3 className="h-4 w-4 text-amber-500"/>
 <span className="text-sm font-medium tracking-[0.3em] text-amber-500">Record Modification</span>
 </div>
 <DialogTitle className="text-3xl font-medium text-slate-900 dark:text-white">Edit Review</DialogTitle>
 <DialogDescription className="font-medium text-slate-500">
 Update client testimonials and quantitative metrics.
 </DialogDescription>
 </DialogHeader>

 <div className="space-y-6">
 <div className="space-y-3">
 <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
 <Star className="h-3 w-3"/> Sentiment Rating (1-5)
 </label>
 <div className="relative group">
 <Input
 type="number"
 min={1}
 max={5}
 value={rating}
 onChange={(e) => setRating(Number(e.target.value))}
 placeholder="Rating (1-5)"
 className="h-16 pl-10 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-amber-500/30 text-xl font-medium text-slate-900 dark:text-white transition-all duration-500"
 />
 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
 <Star className="h-4 w-4 text-amber-400 fill-amber-400"/>
 </div>
 </div>
 </div>

 <div className="space-y-3">
 <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
 <MessageSquare className="h-3 w-3"/> Testimonial Content
 </label>
 <Textarea
 value={comment}
 onChange={(e) => setComment(e.target.value)}
 placeholder="Detailed client feedback..."
 className="min-h-[150px] p-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-[2rem] shadow-inner focus-visible:ring-amber-500/30 font-bold text-slate-700 dark:text-slate-300 transition-all duration-500 leading-relaxed shadow-xs"
 />
 </div>
 </div>

 <Separator className="bg-slate-100 dark:bg-slate-800/50"/>

 <div className="flex gap-4">
 <Button 
 variant="outline"
 onClick={onClose} 
 disabled={loading}
 className="flex-1 h-16 rounded-[1.5rem] border-slate-200 dark:border-slate-800 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
 >
 Cancel Operation
 </Button>
 <Button 
 onClick={handleSave} 
 disabled={loading}
 className="flex-[1.5] h-16 rounded-[1.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-500 shadow-xl shadow-slate-900/10 active:scale-[0.98]"
 >
 {loading ? <RefreshCw className="mr-3 h-5 w-5 animate-spin"/> : <Save className="mr-3 h-5 w-5"/>}
 {loading ?"Committing Data...":"Commit Update"}
 </Button>
 </div>
 </div>
 </DialogContent>
 </Dialog>
 );
}

import { RefreshCw } from"lucide-react";
