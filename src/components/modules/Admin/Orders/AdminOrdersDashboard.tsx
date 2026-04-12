// components/admin/orders/AdminOrdersDashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { IOrder, OrderStatus } from "@/types/order.interface";
import {
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "@/action/order/order.action";
import OrderDetailsDialog from "./OrderDetailsDialog";
import UpdateStatusDialog from "./UpdateStatusDialog";
import DeleteOrderDialog from "./DeleteOrderDialog";
import Pagination from "@/components/Shared/Pagination";

interface OrdersResponse {
  data: IOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const AdminOrdersDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();
      queryParams.set("page", pagination.page.toString());
      queryParams.set("limit", pagination.limit.toString());
      queryParams.set("sortBy", "createdAt");
      queryParams.set("sortOrder", "desc");

      if (searchTerm) {
        queryParams.set("searchTerm", searchTerm);
      }

      if (statusFilter !== "all") {
        queryParams.set("status", statusFilter);
      }

      const response = await getAllOrders(queryParams.toString());
      console.log(response);

      if (response?.data) {
        const mappedOrders = response.data.map((order: any) => ({
          ...order,
          orderDate: order.orderDate || order.createdAt,
          deliveryDetails: order.deliveryDetails || {},
        })) as IOrder[];
        setOrders(mappedOrders);

        if (response && "pagination" in response) {
          setPagination((response as unknown as OrdersResponse).pagination);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.limit, statusFilter]);

  // Handle search
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchOrders();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Status badge colors
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case OrderStatus.PAID:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Paid
          </Badge>
        );
      case OrderStatus.SHIPPED:
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Shipped
          </Badge>
        );
      case OrderStatus.COMPLETED:
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Delivered
          </Badge>
        );
      case OrderStatus.CANCELLED:
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle status update
  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus);

      if (response?.data) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
        setIsStatusUpdateOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await cancelOrder(orderId);

      if (response?.data) {
        toast.success("Order cancelled successfully");
        fetchOrders();
        setIsDeleteOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">


      {/* Filter Matrix */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by Order ID, Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-14 pl-11 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus:ring-primary-custom/30 font-bold transition-all duration-300 uppercase text-[10px] tracking-widest">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
              <SelectItem value="all" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">All Status</SelectItem>
              <SelectItem value="PENDING" className="rounded-xl font-bold uppercase text-[10px] tracking-widest text-amber-500">Pending</SelectItem>
              <SelectItem value="PROCESSING" className="rounded-xl font-bold uppercase text-[10px] tracking-widest text-blue-500">Processing</SelectItem>
              <SelectItem value="SHIPPED" className="rounded-xl font-bold uppercase text-[10px] tracking-widest text-purple-500">Shipped</SelectItem>
              <SelectItem value="DELIVERED" className="rounded-xl font-bold uppercase text-[10px] tracking-widest text-green-500">Delivered</SelectItem>
              <SelectItem value="CANCELLED" className="rounded-xl font-bold uppercase text-[10px] tracking-widest text-rose-500">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-3 h-14">
            <Button 
              onClick={handleSearch} 
              className="flex-1 rounded-2xl h-full bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none"
            >
              <Filter className="h-3.5 w-3.5 mr-2" />
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="rounded-2xl h-full px-6 border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

          {/* Orders Intelligent List - Premium Card Experience */}
          <div className="rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="overflow-x-auto scrollbar-premium">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-transparent px-6 text-left">
                    <TableHead className="py-6 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Items</TableHead>
                    <TableHead className="text-right py-6 pr-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-20">
                        <div className="flex flex-col items-center gap-4">
                          <RefreshCw className="h-8 w-8 animate-spin text-primary-custom" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-20">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">No Orders Found</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id} className="premium-table-row border-b border-slate-100/30 dark:border-slate-800/20 group/row">
                        <TableCell className="py-5 pl-8">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-black text-primary-custom bg-primary-custom/5 px-2 py-1 rounded-lg border border-primary-custom/10 w-fit">
                              #{order.id?.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-black text-slate-900 dark:text-white group-hover/row:text-primary-custom transition-colors">
                              {order.deliveryDetails?.name || "Anonymous Entity"}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 lowercase tracking-tight">
                              {order.deliveryDetails?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                              {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {new Date(order.orderDate || order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">
                            {formatCurrency(order.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold text-[10px] text-slate-500 border border-slate-200/50">
                            {order.items?.length || 0} Units
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all active:scale-90">
                                <MoreHorizontal className="h-5 w-5 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-3xl glass-card animate-in zoom-in-95 duration-200">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsDetailsOpen(true);
                                }}
                                className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
                              >
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                  <Eye className="h-4 w-4 text-blue-500" />
                                </div>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsStatusUpdateOpen(true);
                                }}
                                disabled={order.status === OrderStatus.CANCELLED}
                                className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
                              >
                                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                  <Edit className="h-4 w-4 text-amber-500" />
                                </div>
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="mx-2 bg-slate-100 dark:bg-slate-800/50" />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsDeleteOpen(true);
                                }}
                                disabled={order.status === OrderStatus.CANCELLED}
                                className="flex items-center gap-3 p-3 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 transition-all cursor-pointer font-bold text-rose-500"
                              >
                                <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                                  <Trash2 className="h-4 w-4" />
                                </div>
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 1 }))}
              className="mt-6 pt-2"
            />
          )}

      {/* Dialogs */}
      {selectedOrder && (
        <>
          <OrderDetailsDialog
            order={selectedOrder}
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedOrder(null);
            }}
            onStatusUpdate={() => {
              setIsDetailsOpen(false);
              setIsStatusUpdateOpen(true);
            }}
          />

          <UpdateStatusDialog
            order={selectedOrder}
            isOpen={isStatusUpdateOpen}
            onClose={() => {
              setIsStatusUpdateOpen(false);
              setSelectedOrder(null);
            }}
            onUpdate={handleStatusUpdate}
          />

          <DeleteOrderDialog
            order={selectedOrder}
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedOrder(null);
            }}
            onConfirm={handleCancelOrder}
          />
        </>
      )}
    </div>
  );
};

export default AdminOrdersDashboard;
