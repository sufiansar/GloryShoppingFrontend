// components/admin/orders/UpdateStatusDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";
import { IOrder, OrderStatus } from "@/types/order.interface";

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
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: OrderStatus.PENDING, label: "Pending" },
    { value: OrderStatus.PAID, label: "Paid" },
    { value: OrderStatus.SHIPPED, label: "Shipped" },
    { value: OrderStatus.COMPLETED, label: "Completed" },
    { value: OrderStatus.CANCELLED, label: "Cancelled" },
  ];
  // Show all possible statuses so admin can pick any status directly
  const validStatuses = statusOptions.map((opt) => opt.value);

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
        return "Order has been placed but not yet confirmed";
      case OrderStatus.PAID:
        return "Order is being prepared for shipment";
      case OrderStatus.SHIPPED:
        return "Order has been shipped and is in transit";
      case OrderStatus.COMPLETED:
        return "Order has been delivered to the customer";
      case OrderStatus.CANCELLED:
        return "Order has been cancelled";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Update the status for order #{order.id?.slice(-8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Current Status</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {order.status}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">New Status</p>
            <Select
              value={selectedStatus}
              onValueChange={(value: OrderStatus) => setSelectedStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStatus && (
              <p className="text-sm text-gray-500 mt-2">
                {getStatusDescription(selectedStatus)}
              </p>
            )}
          </div>

          {selectedStatus === OrderStatus.CANCELLED && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Cancelling an order is irreversible. The
                customer will be notified about the cancellation.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={updating}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={updating || selectedStatus === order.status}
          >
            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusDialog;
