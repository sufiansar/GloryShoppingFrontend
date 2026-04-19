import { getMyProfile } from "@/action/user/user.action";
import { getMyOrders } from "@/action/order/order.action";
import { Package, Clock, CheckCircle, User, Activity } from "lucide-react";
import Link from "next/link";

const UserDashboard = async () => {
  const profileRes = await getMyProfile();
  let user: any = null;
  if ((profileRes as any)?.success && (profileRes as any).data) {
    user = (profileRes as any).data;
  }

  const ordersRes = await getMyOrders({ page: 1, limit: 10 });
  const orders = ordersRes?.data || [];
  
  const totalOrders = orders.length || 0;
  const pendingOrders = orders.filter((o: any) => o.status === "PENDING").length || 0;
  const completedOrders = orders.filter((o: any) => o.status === "COMPLETED" || o.status === "SHIPPED" || o.status === "PAID").length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2 p-8 rounded-3xl bg-gradient-to-r from-pink-600 to-rose-400 text-white shadow-xl shadow-pink-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold font-heading">
            Welcome back, {user?.name || "Customer"} 👋
          </h1>
          <p className="text-pink-100 mt-2 max-w-xl text-lg">
            Manage your recent orders, track your packages, and explore new skin care collections tailored for you.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-500 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
            <Package size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Orders</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalOrders}</h3>
          </div>
        </div>

        <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Pending Orders</p>
            <h3 className="text-2xl font-bold text-slate-800">{pendingOrders}</h3>
          </div>
        </div>

        <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Completed</p>
            <h3 className="text-2xl font-bold text-slate-800">{completedOrders}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:border-pink-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
              <Activity size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 font-heading">Recent Activity</h2>
          </div>
          
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order: any) => (
                <div key={order.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 hover:bg-pink-50 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-800">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600">৳{order.amount}</p>
                    <p className="text-xs font-medium text-slate-500">{order.status}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 flex justify-center">
                <Link href="/dashboard/user/orders" className="text-pink-600 font-medium hover:text-pink-700 transition-colors">
                  View All Orders →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
              <Link href="/product" className="inline-block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium transition-all shadow-md shadow-pink-500/20">
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 font-heading">Account details</h2>
          </div>
          
          <div className="space-y-4 text-slate-600">
            <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Full Name</span>
              <span className="font-medium text-slate-800">{user?.name || "Not specified"}</span>
            </div>
            <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email Address</span>
              <span className="font-medium text-slate-800">{user?.email || "Not specified"}</span>
            </div>
            <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Phone</span>
              <span className="font-medium text-slate-800">{user?.phone || "Not specified"}</span>
            </div>

            <div className="pt-4">
              <Link href="/profile" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Edit Profile Settings →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
