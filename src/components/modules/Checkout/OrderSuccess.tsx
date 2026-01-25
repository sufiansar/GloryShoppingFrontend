// components/checkout/OrderSuccess.tsx
"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, Package, Printer, Home, Clock } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Order } from "@/types/checkout.interface";
import { toast } from "sonner";

interface OrderSuccessProps {
  order: Order;
  onContinueShopping?: () => void;
}

export function OrderSuccess({ order, onContinueShopping }: OrderSuccessProps) {
  useEffect(() => {
    toast("Order Successful!", {
      description: `Your order #${order.id} has been placed successfully.`,
    });
  }, [order.id]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "PAID":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-green-200 print:shadow-none">
        <CardHeader className="text-center print:pt-0">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Thank you for your purchase. A confirmation has been sent to{" "}
            <strong>{order.delivery?.email}</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-8 print:space-y-4">
          {/* Order Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">
                Order ID
              </p>
              <p className="font-mono text-lg font-bold">{order.id}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
                {order.status}
              </Badge>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg font-semibold">
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-green-600">
                ${order.amount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{order.delivery?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.delivery?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.delivery?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{order.delivery?.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{order.delivery?.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Postal Code</p>
                    <p className="font-medium">{order.delivery?.postalCode}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Delivery Status
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {order.delivery?.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{item.product}</p>
                        <p className="text-sm text-muted-foreground">
                          Variant: {item.productVariantId.slice(0, 8)}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="text-sm">
                            Price: ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="mt-6 space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      $
                      {order.productTotal?.toFixed(2) ||
                        order.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>${order.deliveryCharge?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${order.amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Order Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your items for shipment
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order will be shipped within 24-48 hours
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Expected delivery in 3-5 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 print:hidden">
            <Button variant="outline" className="flex-1" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a
                href={`mailto:${order.delivery?.email}?subject=Order Inquiry #${order.id}`}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </a>
            </Button>
            <Button className="flex-1" onClick={onContinueShopping}>
              <Home className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground pt-4 border-t">
            Need help? Contact our customer support at support@example.com or
            call (555) 123-4567
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
