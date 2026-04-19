import { getMyOrders } from "@/action/order/order.action";
import { PackageOpen, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type OrderStatus = "PENDING" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "PAID";

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none transition-colors px-3 py-1"><Clock size={14} className="mr-1" /> Pending</Badge>;
    case "PAID":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none transition-colors px-3 py-1"><CheckCircle size={14} className="mr-1" /> Paid</Badge>;
    case "SHIPPED":
      return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none transition-colors px-3 py-1"><Truck size={14} className="mr-1" /> Shipped</Badge>;
    case "COMPLETED":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none transition-colors px-3 py-1"><CheckCircle size={14} className="mr-1" /> Completed</Badge>;
    case "CANCELLED":
      return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none transition-colors px-3 py-1"><XCircle size={14} className="mr-1" /> Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const MyOrdersPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const res = await getMyOrders({ page: currentPage, limit: 10 });
  const orders = res?.data || [];
  const pagination = res?.pagination || { page: 1, totalPages: 1 };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">My Orders</h1>
          <p className="text-slate-500 mt-1">View and track your previous purchases</p>
        </div>
        <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl">
          <ShoppingBag size={28} />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="bg-slate-50 p-6 rounded-full text-slate-400 mb-6 border border-slate-100">
            <PackageOpen size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2 font-heading">No orders found</h2>
          <p className="text-slate-500 mb-8 max-w-md text-center">Looks like you haven't made your first purchase yet. Explore our collections and find something you love!</p>
          <Link href="/product" className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 p-6 bg-slate-50/80 border-b border-slate-100 font-semibold text-slate-600 text-sm tracking-wide uppercase">
            <div className="col-span-3">Order Details</div>
            <div className="col-span-3">Items</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Date</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {orders.map((order: any) => (
              <div key={order.id} className="grid lg:grid-cols-12 gap-6 lg:gap-4 p-6 items-center hover:bg-slate-50/50 transition-colors">
                
                {/* Mobile View Header */}
                <div className="lg:hidden flex justify-between items-center w-full mb-2">
                  <span className="font-bold text-slate-800 font-heading line-clamp-1">#{order.id.split('-')[0].toUpperCase()}</span>
                  {getStatusBadge(order.status as OrderStatus)}
                </div>

                {/* Order Match Details */}
                <div className="col-span-12 lg:col-span-3">
                  <div className="hidden lg:block font-bold text-slate-800 font-heading mb-1 line-clamp-1">
                    #{order.id.split('-')[0].toUpperCase()}
                  </div>
                  <div className="text-sm text-slate-500 truncate" title={order.delivery?.address}>
                    Deliver to: <span className="font-medium text-slate-700">{order.delivery?.city}</span>
                  </div>
                </div>

                 {/* Order Items Summary */}
                 <div className="col-span-12 lg:col-span-3 flex items-center -space-x-4">
                  {order?.items?.slice(0, 3).map((item: any, idx: number) => {
                    const imgUrl = item.variant?.product?.thumbleImage;
                    return (
                      <div key={item.id} className="border-2 border-white rounded-full shadow-sm bg-white overflow-hidden w-12 h-12 relative flex-shrink-0 z-10" style={{ zIndex: 10 - idx }}>
                        <Image
                          src={imgUrl || "/placeholder.png"}
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                  {order?.items?.length > 3 && (
                    <div className="border-2 border-white rounded-full bg-slate-100 text-xs font-bold text-slate-500 w-12 h-12 flex items-center justify-center relative flex-shrink-0 z-0">
                      +{order.items.length - 3}
                    </div>
                  )}
                  {order.items?.length === 0 && (
                     <span className="text-slate-400 text-sm ml-4">No specific items</span>
                  )}
                </div>

                {/* Status - Desktop */}
                <div className="hidden lg:flex col-span-2 justify-center">
                  {getStatusBadge(order.status as OrderStatus)}
                </div>

                {/* Date */}
                <div className="col-span-6 lg:col-span-2 text-left lg:text-center text-slate-600 text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>

                {/* Amount */}
                <div className="col-span-6 lg:col-span-2 text-right">
                   <div className="font-bold text-lg text-pink-600 tracking-tight">৳{order.amount}</div>
                   <div className="text-xs text-slate-400 font-medium">Includes delivery</div>
                </div>

              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-6 border-t border-slate-100 flex justify-center gap-2">
               {Array.from({ length: pagination.totalPages }).map((_, i) => (
                 <Link 
                   key={i} 
                   href={`/dashboard/user/orders?page=${i + 1}`}
                   className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition-all ${
                     currentPage === i + 1 
                       ? "bg-pink-600 text-white shadow-md shadow-pink-500/20 scale-105" 
                       : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                   }`}
                  >
                   {i + 1}
                 </Link>
               ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
