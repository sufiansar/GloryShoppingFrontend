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

export default async function AdminDashboardPage() {
  await getorderStats();

  const [orderStats, bestProducts, categoryStats, userStats] =
    await Promise.all([
      (async () => {
        try {
          const res = await getorderStats();
          if (!res) {
            console.error("No order stats data found", res);
            return null;
          }
          if (res.error) {
            console.error("Error fetching order stats:", res.error);
            return null;
          }
          return res?.data;
        } catch (e) {
          console.error("Failed to load order stats:", e);
          return null;
        }
      })(),
      // best products
      (async () => {
        try {
          const res = await bestProucts();
          return res?.data;
        } catch (e) {
          console.error("Failed to load best products:", e);
          return null;
        }
      })(),
      (async () => {
        try {
          const res = await getCategoryStats();
          if (!res) {
            console.error("No category stats data found", res);
            return null;
          }
          if (res.error) {
            console.error("Error fetching category stats:", res.error);
            return null;
          }
          if (!Array.isArray(res.data)) {
            console.error("Category stats data is not an array:", res.data);
            return null;
          }
          console.log("Category stats data:", res.data);
          if (res.data.length === 0) {
            console.warn("No category stats available");
            return null;
          }
          return res?.data;
        } catch (e) {
          console.error("Failed to load category stats:", e);
          return null;
        }
      })(),
      (async () => {
        try {
          const res = await getUserStats();
          return res?.data;
        } catch (e) {
          console.error("Failed to load user stats:", e);
          return null;
        }
      })(),
    ]);
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-emerald-50 via-white to-slate-50 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.12),transparent_40%)]" />
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-slate-200/70 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live store insights
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Plan, prioritize, and track your store performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="rounded-full shadow-sm">+ Add Project</Button>
            <Button variant="outline" className="rounded-full bg-white/70">
              Import Data
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardOverview />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl border bg-white/80 shadow-sm backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order Statistics</CardTitle>
                <CardDescription>Orders and revenue over time</CardDescription>
              </div>
              <div className="rounded-full border bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Weekly trend
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <OrderStatsChart data={orderStats} />
              </Suspense>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-3xl border bg-white/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Best Selling Products</CardTitle>
                <CardDescription>Top 5 products by sales</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ChartSkeleton />}>
                  <BestProductsChart data={bestProducts} />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-white/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Sales by category</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ChartSkeleton />}>
                  <CategoryStatsChart data={categoryStats} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border bg-white/80 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>User distribution and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <UserStatsChart data={userStats} />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border bg-white/80 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle>Most Cancelled Products</CardTitle>
              <CardDescription>Top 5 cancellation trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <CancelledProductsList />
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-75 w-full" />;
}

async function CancelledProductsList() {
  const cancelledProducts = await getAllcencleProducts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Cancelled Products</CardTitle>
        <CardDescription>
          Top 5 products with highest cancellations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cancelledProducts?.data?.map((product: any, index: any) => (
            <div
              key={product.productVariantId}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">
                    Product ID: {product.productVariantId.substring(0, 8)}...
                  </p>
                  <p className="text-sm text-muted-foreground">Variant ID</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600">
                  {product.totalCancelled}
                </p>
                <p className="text-sm text-muted-foreground">Cancellations</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
