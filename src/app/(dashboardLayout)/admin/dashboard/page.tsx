import { Suspense } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import DashboardOverview from "@/components/modules/Admin/Stats/DashboardOverview";
import OrderStatsChart from "@/components/modules/Admin/Stats/OrderStatsChart";
import BestProductsChart from "@/components/modules/Admin/Stats/BestProductsChart";
import CategoryStatsChart from "@/components/modules/Admin/Stats/CategoryStatsChart";
import UserStatsChart from "@/components/modules/Admin/Stats/UserStatsChart";
import {
  getorderStats,
  getAllcencleProducts,
  bestProucts,
  getCategoryStats,
  getUserStats,
} from "@/action/stats/stats.action";
import { getMyProfile } from "@/action/user/user.action";
import {
  TrendingUp,
  BarChart3,
  Package,
  Users,
  AlertCircle,
  Download,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const profileRes = await getMyProfile();
  const userData = (profileRes as any)?.data;

  // Fetch order stats
  let orderStats = null;
  let revenueStats = {
    last7Days: { totalQuantity: 0, totalAmount: 0 },
    last15Days: { totalQuantity: 0, totalAmount: 0 },
    last30Days: { totalQuantity: 0, totalAmount: 0 },
  };

  try {
    const res = await getorderStats();
    if (res?.success && res.data) {
      orderStats = res.data;
      revenueStats = {
        last7Days: res.data.last7Days || { totalQuantity: 0, totalAmount: 0 },
        last15Days: res.data.last15Days || { totalQuantity: 0, totalAmount: 0 },
        last30Days: res.data.last30Days || { totalQuantity: 0, totalAmount: 0 },
      };
      console.log(res, "Orderstats");
      console.log("Revenue stats:", revenueStats);
    } else {
      console.error("No order stats data found", res);
    }
  } catch (e) {
    console.error("Failed to load order stats:", e);
  }

  // Fetch best products
  let bestProducts = null;
  try {
    const res = await bestProucts();
    if (res?.success && res.data) {
      bestProducts = res.data;
    } else {
      console.error("No best products data found", res);
    }
  } catch (e) {
    console.error("Failed to load best products:", e);
  }

  // Fetch category stats
  let categoryStats = null;
  try {
    const res = await getCategoryStats();
    if (res?.success && res.data) {
      categoryStats = res.data;
      console.log("Category stats:", categoryStats);
    } else {
      console.error("No category stats data found", res);
    }
  } catch (e) {
    console.error("Failed to load category stats:", e);
  }

  // Fetch user stats
  let userStats = null;
  try {
    const res = await getUserStats();
    if (res?.success && res.data) {
      userStats = res.data;
      console.log("User stats:", userStats);
    } else {
      console.error("No user stats data found", res);
    }
  } catch (e) {
    console.error("Failed to load user stats:", e);
  }
  return (
    <div className="space-y-10 pb-10">
      {/* Modern Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-12 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-custom blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-secondary-custom blur-[80px]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur-md ring-1 ring-white/20 tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              <span>Platform Intelligence</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white lg:text-6xl">
              Hello, <span className="text-primary-custom">{userData?.name?.split(' ')[0] || 'Admin'}</span>
            </h1>
            <p className="max-w-lg text-slate-400 text-sm md:text-lg leading-relaxed font-medium">
              Your store is performing <span className="text-white">excellently</span> today. Here&apos;s a quick summary of your business metrics and recent activities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="glass-card flex items-center gap-4 rounded-3xl p-4 ring-1 ring-white/10 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-custom/20 text-primary-custom shadow-inner">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Timeline</span>
                <span className="text-sm font-black text-white">
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Overview Cards */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardOverview orderStats={orderStats} userStats={userStats} />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reports Chart - Takes 2 columns */}
        <Card className="lg:col-span-2 rounded-[2rem] border-0 bg-white p-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Revenue Insights
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-500">
                Detailed performance of orders and revenue
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-1.5 ring-1 ring-slate-100">
              <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-primary-custom hover:shadow-sm transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Suspense fallback={<ChartSkeleton />}>
              <OrderStatsChart data={orderStats} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Analytics Donut Chart - Takes 1 column */}
        <Card className="rounded-[2rem] border-0 bg-white p-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-100">
          <CardHeader className="pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                User Analytics
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-500">
                Customer distribution
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Suspense fallback={<ChartSkeleton />}>
              <UserStatsChart data={userStats} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <Card className="rounded-[2rem] border-0 bg-white p-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Recent Transitions
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-500">
                Latest operations monitoring
              </CardDescription>
            </div>
            <Link href="/admin/dashboard/orders-management" className="text-xs font-bold text-primary-custom hover:underline flex items-center gap-1 group">
              View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <Suspense fallback={<ChartSkeleton />}>
              <CancelledProductsList />
            </Suspense>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="rounded-[2rem] border-0 bg-white p-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-100">
          <CardHeader className="pt-6 px-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Best Sellers
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-500">
                Top performing inventory items
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Suspense fallback={<ChartSkeleton />}>
              <BestProductsChart data={bestProducts} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="rounded-2xl border-2 border-rose-100/80 shadow-lg"
        >
          <CardContent className="p-6">
            <Skeleton className="h-32 w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-75 w-full rounded-xl" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

async function CancelledProductsList() {
  const cancelledProducts = await getAllcencleProducts();

  if (!cancelledProducts?.data || cancelledProducts.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-50 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">
          No order data available
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Reference
            </th>
            <th className="text-left py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Information
            </th>
            <th className="text-right py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Unit Price
            </th>
            <th className="text-center py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Qty
            </th>
            <th className="text-right py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {cancelledProducts?.data
            ?.slice(0, 5)
            .map((product: any, index: any) => (
              <tr
                key={product.productVariantId}
                className="group hover:bg-slate-50/50 transition-all duration-300"
              >
                <td className="py-5 px-2">
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg ring-1 ring-slate-200/50">
                    #{product.productVariantId.substring(0, 8)}
                  </span>
                </td>
                <td className="py-5 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Package className="w-5 h-5 text-primary-custom" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-900 font-bold truncate max-w-[120px]">
                        {product.productVariantId.substring(0, 15)}...
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium italic">Standard Product</span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-2 text-right">
                  <span className="text-sm font-black text-slate-900">
                    ${(product.totalCancelled * 1.4).toFixed(2)}
                  </span>
                </td>
                <td className="py-5 px-2 text-center">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-lg text-xs font-black bg-blue-50 text-blue-600 ring-1 ring-blue-100 uppercase">
                    {product.totalCancelled}x
                  </span>
                </td>
                <td className="py-5 px-2 text-right">
                  <span className="text-sm font-black text-primary-custom">
                    $
                    {(
                      product.totalCancelled *
                      1.4 *
                      product.totalCancelled
                    ).toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
