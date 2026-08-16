// components/admin/orders/DeleteOrderDialog.tsx
import React, { useState } from"react";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";

import { AlertTriangle, Loader2 } from"lucide-react";
import { IOrder } from"@/types/order.interface";

interface DeleteOrderDialogProps {
 order: IOrder;
 isOpen: boolean;
 onClose: () => void;
 onConfirm: (orderId: string) => Promise<void>;
}

const DeleteOrderDialog: React.FC<DeleteOrderDialogProps> = ({
 order,
 isOpen,
 onClose,
 onConfirm,
}) => {
 const [confirmText, setConfirmText] = useState("");
 const [cancelling, setCancelling] = useState(false);

 const handleCancelOrder = async () => {
 if (!order.id) return;

 try {
 setCancelling(true);
 await onConfirm(order.id);
 } finally {
 setCancelling(false);
 }
 };

 const isConfirmed = confirmText === `cancel ${order.id?.slice(-8)}`;

 return (
 <Dialog open={isOpen} onOpenChange={onClose}>
 <DialogContent>
 <DialogHeader>
 <DialogTitle className="flex items-center gap-2 text-red-600">
 <AlertTriangle className="h-5 w-5"/>
 Cancel Order
 </DialogTitle>
 <DialogDescription>
 This action cannot be undone. This will permanently cancel order #
 {order.id?.slice(-8).toUpperCase()}.
 </DialogDescription>
 </DialogHeader>

 <div className="space-y-4">
 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
 <div className="flex items-start gap-3">
 <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5"/>
 <div>
 <h4 className="font-medium text-red-800">Warning</h4>
 <p className="text-sm text-red-700 mt-1">
 Cancelling this order will:
 </p>
 <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
 <li>Refund the customer's payment</li>
 <li>Remove the order from active orders</li>
 <li>Notify the customer about the cancellation</li>
 <li>Update inventory if items were reserved</li>
 </ul>
 </div>
 </div>
 </div>

 <div className="space-y-2">
 <Label htmlFor="confirm">
 Type{""}
 <code className="font-mono">cancel {order.id?.slice(-8)}</code> to
 confirm
 </Label>
 <Input
 id="confirm"
 value={confirmText}
 onChange={(e) => setConfirmText(e.target.value)}
 placeholder={`cancel ${order.id?.slice(-8)}`}
 />
 </div>
 </div>

 <DialogFooter>
 <Button variant="outline"onClick={onClose} disabled={cancelling}>
 Go Back
 </Button>
 <Button
 variant="destructive"
 onClick={handleCancelOrder}
 disabled={!isConfirmed || cancelling}
 >
 {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
 Cancel Order
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 );
};

export default DeleteOrderDialog;
