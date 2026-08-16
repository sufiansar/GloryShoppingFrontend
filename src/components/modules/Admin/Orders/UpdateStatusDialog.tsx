// components/admin/orders/UpdateStatusDialog.tsx
import React, { useState, useEffect } from"react";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
} from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";
import { Loader2, RefreshCw, AlertCircle, Info, CheckCircle2, Truck, XCircle } from"lucide-react";
import { IOrder, OrderStatus } from"@/types/order.interface";
import { Badge } from"@/components/ui/badge";

interface UpdateStatusDialogProps {
 order: IOrder;
 isOpen: boolean;
 onClose: () => void;
 onUpdate: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({
 order,
 isOpen,
 onClose,
 onUpdate,
}) => {
 const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
 const [updating, setUpdating] = useState(false);

 useEffect(() => {
 setSelectedStatus(order.status);
 }, [order.status, isOpen]);

 const statusOptions = [
 { value: OrderStatus.PENDING, label:"Pending", icon: Info, color:"text-yellow-500"},
 { value: OrderStatus.PAID, label:"Paid", icon: CheckCircle2, color:"text-blue-500"},
 { value: OrderStatus.SHIPPED, label:"Shipped", icon: Truck, color:"text-purple-500"},
 { value: OrderStatus.COMPLETED, label:"Completed", icon: CheckCircle2, color:"text-green-500"},
 { value: OrderStatus.CANCELLED, label:"Cancelled", icon: XCircle, color:"text-red-500"},
 ];

 const handleUpdate = async () => {
 if (!order.id) return;

 try {
 setUpdating(true);
 await onUpdate(order.id, selectedStatus);
 } finally {
 setUpdating(false);
 }
 };

 const getStatusDescription = (status: OrderStatus) => {
 switch (status) {
 case OrderStatus.PENDING:
 return"Order has been placed but not yet confirmed";
 case OrderStatus.PAID:
 return"Order is being prepared for shipment";
 case OrderStatus.SHIPPED:
 return"Order has been shipped and is in transit";
 case OrderStatus.COMPLETED:
 return"Order has been delivered to the customer";
 case OrderStatus.CANCELLED:
 return"Order has been cancelled";
 default:
 return"";
 }
 };

 const getStatusBadgeColor = (status: OrderStatus) => {
 switch (status) {
 case OrderStatus.PENDING:
 return"bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
 case OrderStatus.PAID:
 return"bg-blue-500/10 text-blue-500 border-blue-500/20";
 case OrderStatus.SHIPPED:
 return"bg-purple-500/10 text-purple-500 border-purple-500/20";
 case OrderStatus.COMPLETED:
 return"bg-green-500/10 text-green-500 border-green-500/20";
 case OrderStatus.CANCELLED:
 return"bg-red-500/10 text-red-500 border-red-500/20";
 default:
 return"bg-gray-500/10 text-gray-400 border-gray-500/20";
 }
 };

 return (
 <Dialog open={isOpen} onOpenChange={onClose}>
 <DialogContent className="max-w-xl p-0 overflow-hidden premium-glass-dialog border-none rounded-[2.5rem] shadow-2xl">
 <div className="p-8 space-y-8">
 <DialogHeader className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-primary-custom/10 flex items-center justify-center border border-primary-custom/20">
 <RefreshCw className="h-5 w-5 text-primary-custom"/>
 </div>
 <div className="text-left">
 <DialogTitle className="text-2xl font-medium text-slate-900 dark:text-white leading-none">
 Update Order Status
 </DialogTitle>
 <DialogDescription className="text-[11px] font-bold text-slate-500 pt-1">
 Order #{order.id?.slice(-8).toUpperCase()}
 </DialogDescription>
 </div>
 </div>
 </DialogHeader>

 <div className="space-y-6">
 <div className="p-6 rounded-[1.5rem] bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-800/50 shadow-sm">
 <p className="text-sm font-medium text-slate-400 mb-3">Current Status</p>
 <Badge className={`h-10 px-6 rounded-xl text-sm font-medium border transition-all duration-300 ${getStatusBadgeColor(order.status)}`}>
 {order.status}
 </Badge>
 </div>

 <div className="space-y-3">
 <label className="text-sm font-medium text-slate-500 ml-1">Select New Status</label>
 <Select
 value={selectedStatus}
 onValueChange={(value: OrderStatus) => setSelectedStatus(value)}
 >
 <SelectTrigger className="h-14 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-primary-custom/20 shadow-sm transition-all active:scale-[0.99]">
 <SelectValue placeholder="Select status"/>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-3xl glass-card p-1">
 {statusOptions.map((option) => (
 <SelectItem 
 key={option.value} 
 value={option.value} 
 className="rounded-xl p-3 focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold text-sm"
 >
 <div className="flex items-center gap-2">
 <option.icon className={`h-4 w-4 ${option.color}`} />
 {option.label}
 </div>
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 
 {selectedStatus && (
 <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
 <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0"/>
 <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
 {getStatusDescription(selectedStatus)}
 </p>
 </div>
 )}
 </div>

 {selectedStatus === OrderStatus.CANCELLED && (
 <div className="flex items-start gap-4 p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20">
 <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
 <AlertCircle className="h-4 w-4 text-rose-500"/>
 </div>
 <div>
 <p className="text-[11px] font-medium tracking-[0.1em] text-rose-600 mb-1">Critical Notice</p>
 <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
 Cancelling an order is irreversible. The customer will be notified about the cancellation.
 </p>
 </div>
 </div>
 )}
 </div>

 <div className="flex gap-4 pt-4 pb-2">
 <Button 
 variant="outline"
 onClick={onClose} 
 disabled={updating}
 className="flex-1 h-14 rounded-2xl border-slate-200 dark:border-slate-800 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
 >
 Cancel
 </Button>
 <Button
 onClick={handleUpdate}
 disabled={updating || selectedStatus === order.status}
 className="flex-[1.5] h-14 rounded-2xl bg-primary-custom text-white font-medium text-sm hover:shadow-primary-custom/40 transition-all shadow-xl shadow-primary-custom/10 active:scale-[0.98] border-none"
 >
 {updating ? (
 <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
 ) : (
 <CheckCircle2 className="mr-2 h-4 w-4"/>
 )}
 Update Status
 </Button>
 </div>
 </div>
 </DialogContent>
 </Dialog>
 );
};

export default UpdateStatusDialog;
