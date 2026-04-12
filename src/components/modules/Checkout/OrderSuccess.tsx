// components/checkout/OrderSuccess.tsx
"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Mail,
  Package,
  Printer,
  Home,
  Clock,
  Phone,
  MapPin,
  User,
  Truck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Order } from "@/types/checkout.interface";
import { toast } from "sonner";

interface OrderSuccessProps {
  order: Order;
  onContinueShopping?: () => void;
}

export function OrderSuccess({ order, onContinueShopping }: OrderSuccessProps) {
  const baseColor = "oklch(52.801% 0.15987 344.323)";

  useEffect(() => {
    toast("Order Successful!", {
      description: `Your order #${order.id} has been placed successfully.`,
    });
  }, [order.id]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PAID":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-1 pb-8 px-4 bg-slate-50/50">
      <div className="container mx-auto max-w-4xl">

        <Card className="border border-slate-100 shadow-xs bg-white rounded-3xl overflow-hidden print:shadow-none print:border">

          <CardHeader className="text-center print:pt-0 pb-4 pt-4">
            <div className="flex justify-center mb-2">
              <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs">
                 <CheckCircle
                    className="h-12 w-12"
                    style={{ color: baseColor }}
                    strokeWidth={1.5}
                  />
              </div>
            </div>
            <CardTitle
              className="text-3xl md:text-4xl font-black mb-1 tracking-tighter"
              style={{ color: baseColor }}
            >
              Order Confirmed!
            </CardTitle>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
              Thank you for trusting us. A confirmation has been sent to{" "}
              <span className="text-slate-900">
                {order.delivery?.email}
              </span>
            </p>
          </CardHeader>

          <CardContent className="space-y-4 print:space-y-1 px-6 pb-6">
            {/* Order Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100/50 transition-all hover:bg-white hover:border-slate-200">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Order ID</p>
                  <p className="font-mono text-sm font-black text-slate-900 break-all leading-tight">
                    {order.id.slice(0, 13)}...
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100/50 transition-all hover:bg-white hover:border-slate-200">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Status</p>
                  <Badge className={`mt-1 h-8 px-4 border shadow-sm text-xs font-black ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </div>

                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100/50 transition-all hover:bg-white hover:border-slate-200">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Date</p>
                  <p className="text-base font-black text-slate-900 tracking-tight">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100/50 transition-all hover:bg-white hover:border-slate-200">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Total Amount</p>
                  <p className="text-3xl font-black tracking-tighter" style={{ color: baseColor }}>
                    ৳{order.amount.toFixed(2)}
                  </p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2">
              {/* Delivery Information */}
              <Card className="shadow-xs border-slate-100 rounded-3xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle
                    className="flex items-center gap-3 text-xs font-black uppercase tracking-widest"
                    style={{ color: baseColor }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Truck className="h-4 w-4" style={{ color: baseColor }} />
                    </div>
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100/30 rounded-2xl">
                      <User className="h-4 w-4 text-slate-300" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient Name</p>
                        <p className="font-black text-xs text-slate-800">
                          {order.delivery?.name}
                        </p>
                      </div>
                    </div>
                    {/* ... repeat refined pattern for other items ... */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100/30 rounded-2xl">
                      <Phone className="h-4 w-4 text-slate-300" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</p>
                        <p className="font-black text-xs text-slate-800">
                          {order.delivery?.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100/30 rounded-2xl">
                      <Mail className="h-4 w-4 text-slate-300" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                        <p className="font-black text-xs text-slate-800">
                          {order.delivery?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100/30 rounded-2xl">
                      <MapPin className="h-4 w-4 text-slate-300" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Address</p>
                        <p className="font-black text-xs text-slate-800">
                          {order.delivery?.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-50 border border-slate-100/30 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</p>
                      <p className="font-black text-xs text-slate-800">
                        {order.delivery?.city}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100/30 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Postal</p>
                      <p className="font-black text-xs text-slate-800">
                        {order.delivery?.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-slate-500 mb-2">
                      Delivery Status
                    </p>
                    <Badge variant="outline" className="border-slate-200">
                      {order.delivery?.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="shadow-xs border-slate-100 rounded-3xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle
                    className="flex items-center gap-3 text-xs font-black uppercase tracking-widest"
                    style={{ color: baseColor }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Package className="h-4 w-4" style={{ color: baseColor }} />
                    </div>
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-5 bg-white border border-slate-100 rounded-2xl"
                      >
                        <div className="flex-1">
                          <p
                            className="font-black text-sm tracking-tight"
                            style={{ color: baseColor }}
                          >
                            {item.product}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            SKU Ref: {item.productVariantId.slice(0, 8)}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full text-slate-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full text-slate-500">
                              ৳{item.price.toFixed(2)} unit
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-base" style={{ color: baseColor }}>
                            ৳{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="mt-8 space-y-3 pt-6 border-t border-dashed border-slate-200">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-slate-900 font-black">
                        ৳
                        {(order.productTotal || order.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Shipping Charge</span>
                      <span className="text-slate-900 font-black">
                        ৳{order.deliveryCharge?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-4">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Grand Total</span>
                      <span className="text-3xl font-black tracking-tighter" style={{ color: baseColor }}>
                        ৳{order.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xs border-slate-100 rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle
                  className="flex items-center gap-3 text-xs font-black uppercase tracking-widest"
                  style={{ color: baseColor }}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Clock className="h-4 w-4" style={{ color: baseColor }} />
                  </div>
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Order Processing", desc: "We're currently preparing your items for shipment with care." },
                    { title: "Express Shipping", desc: "Your order will be handed over to our couriers within 24-48 hours." },
                    { title: "Rapid Delivery", desc: "Expect your package to arrive at your doorstep in 3-5 business days." }
                  ].map((step, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100/50 flex flex-col items-center text-center group active:scale-95 transition-transform">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-4 font-black shadow-xs" style={{ color: baseColor }}>
                        {idx + 1}
                      </div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-800">
                        {step.title}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-16 rounded-2xl border-slate-100 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all active:scale-95"
                onClick={handlePrint}
              >
                <Printer
                  className="mr-2 h-4 w-4"
                  style={{ color: baseColor }}
                />
                Print Invoice
              </Button>

              <Button
                size="lg"
                className="flex-1 h-16 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95"
                style={{ background: baseColor }}
                onClick={onContinueShopping}
              >
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>

            {/* Support Footer */}
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Need immediate assistance? Contact support at{" "}
                <a
                  href="mailto:support@gloryshop.com"
                  className="font-black text-slate-800 hover:underline"
                  style={{ color: baseColor }}
                >
                  support@gloryshop.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
