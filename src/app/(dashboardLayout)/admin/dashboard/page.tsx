import { Suspense } from "react";

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
import {
  TrendingUp,
  BarChart3,
  Package,
  Users,
  AlertCircle,
  Download,
  Calendar,
} from "lucide-react";

export default async function AdminDashboardPage() {
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Modern Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Monitor your business performance and analytics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>10-06-2020 - 10-10-2020</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardOverview orderStats={orderStats} userStats={userStats} />
        </Suspense>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports Chart - Takes 2 columns */}
          <Card className="lg:col-span-2 rounded-2xl border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Reports
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Track orders and revenue performance
                </CardDescription>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </CardHeader>
            <CardContent className="pt-2">
              <Suspense fallback={<ChartSkeleton />}>
                <OrderStatsChart data={orderStats} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Analytics Donut Chart - Takes 1 column */}
          <Card className="rounded-2xl border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Analytics
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Distribution metrics
                </CardDescription>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <UserStatsChart data={userStats} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders Table */}
          <Card className="rounded-2xl border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Latest customer orders
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <CancelledProductsList />
              </Suspense>
            </CardContent>
          </Card>

          {/* Top Selling Products */}
          <Card className="rounded-2xl border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Top selling Products
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Best performing items
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <BestProductsChart data={bestProducts} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
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
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tracking no
            </th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Product Name
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Price
            </th>
            <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Order
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {cancelledProducts?.data
            ?.slice(0, 5)
            .map((product: any, index: any) => (
              <tr
                key={product.productVariantId}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-2">
                  <span className="text-sm font-medium text-gray-900">
                    #{product.productVariantId.substring(0, 8)}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {product.productVariantId.substring(0, 15)}...
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    ${(product.totalCancelled * 14).toFixed(2)}
                  </span>
                </td>
                <td className="py-4 px-2 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    {product.totalCancelled}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className="text-sm font-bold text-gray-900">
                    $
                    {(
                      product.totalCancelled *
                      14 *
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
