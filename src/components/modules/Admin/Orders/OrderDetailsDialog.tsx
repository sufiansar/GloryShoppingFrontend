// components/admin/orders/OrderDetailsDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Package,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  Hash,
} from "lucide-react";
import { IOrder, OrderStatus } from "@/types/order.interface";

interface OrderDetailsDialogProps {
  order: IOrder;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-500 border-yellow-200/50 dark:border-yellow-500/20";
      case OrderStatus.PAID:
        return "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-500 border-blue-200/50 dark:border-blue-500/20";
      case OrderStatus.SHIPPED:
        return "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-500 border-purple-200/50 dark:border-purple-500/20";
      case OrderStatus.COMPLETED:
        return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500 border-green-200/50 dark:border-green-500/20";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500 border-red-200/50 dark:border-red-500/20";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400 border-gray-200/50 dark:border-gray-500/20";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden premium-glass-dialog border-none rounded-[3rem] shadow-2xl">
        <div className="p-10 space-y-10 overflow-y-auto max-h-[95vh] scrollbar-premium">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-primary-custom" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-custom">Order Access</span>
                 </div>
                 <DialogTitle className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">
                    Order Details - #{order.id?.slice(-8).toUpperCase()}
                 </DialogTitle>
                 <DialogDescription className="font-medium text-slate-500 flex items-center gap-2 pt-1 font-serif text-sm">
                    Order placed on {formatDate(order.orderDate || order.createdAt)}
                 </DialogDescription>
              </div>
              <Badge className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)} shrink-0 shadow-sm`}>
                {order.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="premium-static-surface rounded-[2rem] p-8 border border-white/40 dark:border-slate-800/50 shadow-sm transition-all duration-500 group/card">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover/card:bg-blue-500 transition-colors">
                  <User className="h-5 w-5 text-blue-500 group-hover/card:text-white transition-colors" />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Customer Information</h3>
              </div>
              {(() => {
                const delivery = (order as any).delivery || order.deliveryDetails || {};
                return (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-800/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Name</p>
                      <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{delivery?.name || "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-800/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                      <p className="font-bold text-slate-600 dark:text-slate-300 truncate">{delivery?.email || "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-800/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                      <p className="font-bold text-slate-600 dark:text-slate-300">{delivery?.phone || "N/A"}</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Shipping Information */}
            <div className="premium-static-surface rounded-[2rem] p-8 border border-white/40 dark:border-slate-800/50 shadow-sm transition-all duration-500 group/card">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover/card:bg-amber-500 transition-colors">
                  <MapPin className="h-5 w-5 text-amber-500 group-hover/card:text-white transition-colors" />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Shipping Information</h3>
              </div>
              {(() => {
                const delivery = (order as any).delivery || order.deliveryDetails || {};
                return (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-800/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Address</p>
                      <p className="font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                        {delivery?.address || "N/A"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-800/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">City</p>
                        <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{delivery?.city || "N/A"}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-800/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Postal Code</p>
                        <p className="font-black font-mono text-slate-900 dark:text-white uppercase tracking-tight">{delivery?.postalCode || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Order Items */}
            <div className="md:col-span-2 premium-static-surface rounded-[2rem] p-8 border border-white/40 dark:border-slate-800/50 shadow-sm group/items">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary-custom/10 flex items-center justify-center border border-primary-custom/20">
                  <Package className="h-5 w-5 text-primary-custom" />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Order Items</h3>
              </div>
              <div className="rounded-[1.5rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-primary/40 dark:border-primary/40 overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/50">
                      <th className="text-left p-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Product</th>
                      <th className="text-center p-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Quantity</th>
                      <th className="text-right p-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Price</th>
                      <th className="text-right p-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {order.items?.map((item: any, index: number) => (
                      <tr key={index} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group/row">
                        <td className="p-5">
                          <div>
                            <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1 group-hover/row:text-primary-custom transition-colors">
                              {item.product || item.productVariant?.product?.name || "Product Name"}
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              Variant: {item.productVariant?.name || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                           <span className="inline-flex items-center justify-center h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black text-slate-700 dark:text-slate-300 group-hover:bg-white transition-colors">{item.quantity}</span>
                        </td>
                        <td className="p-5 text-right font-bold text-slate-600 dark:text-slate-400 text-xs">{formatCurrency(item.price)}</td>
                        <td className="p-5 text-right">
                           <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{formatCurrency(item.price * item.quantity)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="premium-static-surface rounded-[2rem] p-8 border border-white/40 dark:border-slate-800/50 shadow-sm relative overflow-hidden group/summary">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-custom/5 blur-3xl -mr-16 -mt-16 rounded-full" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/summary:bg-emerald-500 transition-colors shadow-sm">
                    <DollarSign className="h-5 w-5 text-emerald-500 group-hover/summary:text-white transition-colors" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Order Summary</h3>
                </div>
                <div className="space-y-3">
                  {(() => {
                    const delivery = (order as any).delivery || order.deliveryDetails || {};
                    const deliveryCharge = delivery?.deliveryCharge || 0;
                    return (
                      <>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Subtotal</span>
                          <span className="font-bold text-slate-600 dark:text-slate-300">{formatCurrency(order.amount - deliveryCharge)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Shipping</span>
                          <span className="font-bold text-slate-600 dark:text-slate-300">{formatCurrency(deliveryCharge)}</span>
                        </div>
                        <Separator className="bg-slate-100 dark:bg-slate-800/30 my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Total Amount</span>
                          <span className="text-2xl font-black text-emerald-500 tracking-tight">
                            {formatCurrency(order.amount)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="premium-static-surface rounded-[2rem] p-8 border border-white/40 dark:border-slate-800/50 shadow-sm group/timeline">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover/timeline:bg-indigo-500 transition-colors shadow-sm">
                  <Calendar className="h-5 w-5 text-indigo-500 group-hover/timeline:text-white transition-colors" />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Order Timeline</h3>
              </div>
              <div className="space-y-8 pl-4 border-l border-slate-100 dark:border-slate-800/50 ml-2">
                <div className="relative">
                   <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-sm" />
                   <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Order Placed</p>
                      <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                         {formatDate(order.orderDate || order.createdAt)}
                      </p>
                   </div>
                </div>
                <div className="relative">
                   <div className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-4 border-white dark:border-slate-900 shadow-sm ${
                      ["PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-800"
                   }`} />
                   <div className="space-y-1">
                      <p className={`text-[11px] font-black uppercase tracking-widest ${
                         ["PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? "text-slate-900 dark:text-white" : "text-slate-400"
                      }`}>Order Confirmed</p>
                      <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2 font-mono">
                        {order.status !== "PENDING" ? formatDate(order.updatedAt || "") : "Pending"}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100 dark:bg-slate-800/30" />

          <div className="flex gap-4">
            <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 h-16 rounded-[1.5rem] border-slate-200 dark:border-slate-800 font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm"
            >
              Close
            </Button>
            {order.status !== OrderStatus.CANCELLED &&
              order.status !== OrderStatus.COMPLETED && (
                <Button 
                  onClick={onStatusUpdate}
                  className="flex-[1.5] h-16 rounded-[1.5rem] bg-primary-custom text-white font-black uppercase tracking-widest text-[10px] hover:shadow-primary-custom/40 transition-all shadow-xl shadow-primary-custom/10 active:scale-[0.98] border-none"
                >
                   Update Status
                </Button>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
