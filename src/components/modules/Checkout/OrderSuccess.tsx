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
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: `linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)`,
      }}
    >
      <div className="container mx-auto max-w-5xl">
        {/* Back to Home Indicator */}
        <div className="mb-6">
          <a
            href="/"
            className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200"
            style={{
              boxShadow: `0 4px 12px ${baseColor}20`,
            }}
          >
            <Home
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              style={{ color: baseColor }}
              strokeWidth={2}
            />
            <span className="text-sm font-medium text-slate-700">
              Back to Home
            </span>
          </a>
        </div>

        <Card className="border-0 shadow-2xl backdrop-blur bg-white/90 rounded-3xl overflow-hidden print:shadow-none print:border">
          {/* Decorative header */}
          <div
            className="h-2 w-full"
            style={{
              background: `linear-gradient(90deg, ${baseColor}, #db2777, #2563eb)`,
            }}
          />

          <CardHeader className="text-center print:pt-0 pb-8 pt-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse"
                  style={{ backgroundColor: baseColor }}
                ></div>
                <CheckCircle
                  className="relative h-24 w-24"
                  style={{ color: baseColor }}
                />
              </div>
            </div>
            <CardTitle
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{
                background: `linear-gradient(135deg, ${baseColor}, #db2777, #2563eb)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Order Confirmed!
            </CardTitle>
            <p className="text-slate-600 mt-4 text-lg">
              Thank you for your purchase. A confirmation has been sent to{" "}
              <strong style={{ color: baseColor }}>
                {order.delivery?.email}
              </strong>
            </p>
          </CardHeader>

          <CardContent className="space-y-8 print:space-y-4 px-6 pb-8">
            {/* Order Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
              <div
                className="p-5 rounded-xl shadow-sm border"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, #fdf2f8)`,
                  borderColor: `${baseColor}30`,
                }}
              >
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: baseColor }}
                >
                  Order ID
                </p>
                <p className="font-mono text-sm font-bold text-slate-900 break-all">
                  {order.id.slice(0, 13)}...
                </p>
              </div>

              <div
                className="p-5 rounded-xl shadow-sm border"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, #fdf2f8)`,
                  borderColor: `${baseColor}30`,
                }}
              >
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: baseColor }}
                >
                  Status
                </p>
                <Badge
                  className={`mt-1 border ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </Badge>
              </div>

              <div
                className="p-5 rounded-xl shadow-sm border"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, #fdf2f8)`,
                  borderColor: `${baseColor}30`,
                }}
              >
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: baseColor }}
                >
                  Date
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </p>
              </div>

              <div
                className="p-5 rounded-xl shadow-sm border"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, #fdf2f8)`,
                  borderColor: `${baseColor}30`,
                }}
              >
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: baseColor }}
                >
                  Total
                </p>
                <p className="text-2xl font-bold" style={{ color: baseColor }}>
                  ৳{order.amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2">
              {/* Delivery Information */}
              <Card className="shadow-lg border-0 overflow-hidden">
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${baseColor}, #db2777)`,
                  }}
                />
                <CardHeader>
                  <CardTitle
                    className="flex items-center gap-2"
                    style={{ color: baseColor }}
                  >
                    <Package className="h-5 w-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <User className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Name</p>
                        <p className="font-medium text-sm">
                          {order.delivery?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="font-medium text-sm">
                          {order.delivery?.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium text-sm">
                          {order.delivery?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Address</p>
                        <p className="font-medium text-sm">
                          {order.delivery?.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">City</p>
                      <p className="font-medium text-sm">
                        {order.delivery?.city}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Postal Code</p>
                      <p className="font-medium text-sm">
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
              <Card className="shadow-lg border-0 overflow-hidden">
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${baseColor}, #db2777)`,
                  }}
                />
                <CardHeader>
                  <CardTitle style={{ color: baseColor }}>
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-4 border rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${baseColor}05, #fdf2f8)`,
                          borderColor: `${baseColor}20`,
                        }}
                      >
                        <div className="flex-1">
                          <p
                            className="font-semibold"
                            style={{ color: baseColor }}
                          >
                            {item.product}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Variant ID: {item.productVariantId.slice(0, 8)}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                              ৳{item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: baseColor }}>
                            ৳{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="mt-6 space-y-2 pt-4 border-t border-slate-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium">
                        ৳
                        {order.productTotal?.toFixed(2) ||
                          order.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Delivery Charge</span>
                      <span className="font-medium">
                        ৳{order.deliveryCharge?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span style={{ color: baseColor }}>
                        ৳{order.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <Card className="border-0 overflow-hidden">
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${baseColor}, #db2777, #2563eb)`,
                }}
              />
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2"
                  style={{ color: baseColor }}
                >
                  <Clock className="h-5 w-5" />
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 border rounded-xl bg-slate-50/50">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${baseColor}20` }}
                    >
                      <span className="font-bold" style={{ color: baseColor }}>
                        1
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">
                      Order Processing
                    </h3>
                    <p className="text-xs text-slate-500">
                      We're preparing your items for shipment
                    </p>
                  </div>
                  <div className="text-center p-6 border rounded-xl bg-slate-50/50">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${baseColor}20` }}
                    >
                      <span className="font-bold" style={{ color: baseColor }}>
                        2
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">Shipping</h3>
                    <p className="text-xs text-slate-500">
                      Your order will be shipped within 24-48 hours
                    </p>
                  </div>
                  <div className="text-center p-6 border rounded-xl bg-slate-50/50">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${baseColor}20` }}
                    >
                      <span className="font-bold" style={{ color: baseColor }}>
                        3
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">Delivery</h3>
                    <p className="text-xs text-slate-500">
                      Expected delivery in 3-5 business days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-2 hover:bg-slate-50 transition-all"
                style={{ borderColor: `${baseColor}40` }}
                onClick={handlePrint}
              >
                <Printer
                  className="mr-2 h-5 w-5"
                  style={{ color: baseColor }}
                />
                Print Receipt
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-2 hover:bg-slate-50 transition-all"
                style={{ borderColor: `${baseColor}40` }}
                asChild
              >
                <a
                  href={`mailto:${order.delivery?.email}?subject=Order Inquiry #${order.id}`}
                >
                  <Mail className="mr-2 h-5 w-5" style={{ color: baseColor }} />
                  Contact Support
                </a>
              </Button>

              <Button
                size="lg"
                className="flex-1 text-white transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
                }}
                onClick={onContinueShopping}
              >
                <Home className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </div>

            {/* Support Footer */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Need help? Contact our customer support at{" "}
                <a
                  href="mailto:support@gloryshop.com"
                  className="font-medium hover:underline"
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
