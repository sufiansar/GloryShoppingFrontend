// components/admin/orders/OrderDetailsDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  Package,
  User,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  Truck,
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
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.PAID:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.SHIPPED:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - #{order.id?.slice(-8).toUpperCase()}</span>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Order placed on {formatDate(order.orderDate || order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold">Customer Information</h3>
              </div>
              {/** Prefer `order.delivery` (API) then `order.deliveryDetails` (older shape) */}
              {(() => {
                const delivery =
                  (order as any).delivery || order.deliveryDetails || {};
                return (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{delivery?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{delivery?.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{delivery?.phone || "N/A"}</p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold">Shipping Information</h3>
              </div>
              {(() => {
                const delivery =
                  (order as any).delivery || order.deliveryDetails || {};
                return (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">
                        {delivery?.address || "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">City</p>
                        <p className="font-medium">{delivery?.city || "N/A"}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Postal Code</p>
                        <p className="font-medium">
                          {delivery?.postalCode || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold">Order Items</h3>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">
                        Product
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">
                        Quantity
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">
                        Price
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.items?.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="p-3">
                          <div>
                            <p className="font-medium">
                              {item.product ||
                                item.productVariant?.product?.name ||
                                "Product Name"}
                            </p>
                            <p className="text-sm text-gray-500">
                              Variant: {item.productVariant?.name || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">{formatCurrency(item.price)}</td>
                        <td className="p-3 font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold">Order Summary</h3>
              </div>
              <div className="space-y-2">
                {(() => {
                  const delivery =
                    (order as any).delivery || order.deliveryDetails || {};
                  const deliveryCharge = delivery?.deliveryCharge || 0;
                  return (
                    <>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Subtotal</p>
                        <p className="font-medium">
                          {formatCurrency(order.amount - deliveryCharge)}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Shipping</p>
                        <p className="font-medium">
                          {formatCurrency(deliveryCharge)}
                        </p>
                      </div>
                    </>
                  );
                })()}
                <div className="flex justify-between border-t pt-2">
                  <p className="text-gray-600 font-semibold">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(order.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold">Order Timeline</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.orderDate || order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      ["PROCESSING", "SHIPPED", "DELIVERED"].includes(
                        order.status,
                      )
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-gray-500">
                      {order.status !== "PENDING"
                        ? formatDate(order.updatedAt || "")
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {order.status !== OrderStatus.CANCELLED &&
            order.status !== OrderStatus.COMPLETED && (
              <Button onClick={onStatusUpdate}>Update Status</Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
