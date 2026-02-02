import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [orderStats, bestProducts, categoryStats, userStats] =
    await Promise.all([
      getorderStats().catch((err) => {
        console.error("Failed to load order stats:", err);
        return null;
      }),
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
            console.error("No category stats data found");
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
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your store's performance and analytics
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardOverview />
      </Suspense>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Statistics</CardTitle>
                <CardDescription>
                  Orders and revenue over time periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ChartSkeleton />}>
                  <OrderStatsChart data={orderStats} />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
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
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
              <CardDescription>
                Performance metrics for products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<ChartSkeleton />}>
                  <BestProductsChart data={bestProducts} />
                </Suspense>
                <Suspense fallback={<ChartSkeleton />}>
                  <CancelledProductsList />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
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
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
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
        </TabsContent>
      </Tabs>
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
