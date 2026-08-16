import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from"@/components/ui/alert-dialog";
import { useState } from"react";
import { useRouter } from"next/navigation";
import { deleteBrand } from"@/action/brand/brand.action";
import { toast } from"sonner";

interface DeleteAlertProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
 brandId: string;
 brandName: string;
}

export default function DeleteAlert({
 open,
 onOpenChange,
 brandId,
 brandName,
}: DeleteAlertProps) {
 const router = useRouter();
 const [isDeleting, setIsDeleting] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleDelete = async () => {
 try {
 setIsDeleting(true);
 setError(null);

 const result = await deleteBrand(brandId);
 if (result?.success || result?.data?.id) {
 toast.success("Brand deleted successfully");
 router.refresh();
 onOpenChange(false);
 } else {
 toast.error(result?.message ||"Failed to delete brand");
 }
 } catch (error) {
 console.error("Delete error:", error);
 setError(
 error instanceof Error ? error.message :"Failed to delete brand",
 );
 } finally {
 setIsDeleting(false);
 }
 };

 return (
 <AlertDialog open={open} onOpenChange={onOpenChange}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Delete Brand</AlertDialogTitle>
 <AlertDialogDescription>
 Are you sure you want to delete"{brandName}"? This action cannot be
 undone.
 </AlertDialogDescription>
 </AlertDialogHeader>

 {error && (
 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
 {error}
 </div>
 )}

 <AlertDialogFooter>
 <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={handleDelete}
 disabled={isDeleting}
 className="bg-red-600 hover:bg-red-700"
 >
 {isDeleting ?"Deleting...":"Delete"}
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 );
}
