// @/components/modules/Admin/Stats/DashboardOverview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface DashboardOverviewProps {
  orderStats?: {
    last7Days?: { totalQuantity: number; totalAmount: number };
    last15Days?: { totalQuantity: number; totalAmount: number };
    last30Days?: { totalQuantity: number; totalAmount: number };
  } | null;
  userStats?: {
    totalUsers?: number;
    customerUsers?: number;
    adminUsers?: number;
    superAdminUsers?: number;
  } | null;
}

export default function DashboardOverview({
  orderStats,
  userStats,
}: DashboardOverviewProps) {
  // ডিফল্ট ভ্যালু
  const safeOrderStats = orderStats || {
    last7Days: { totalQuantity: 0, totalAmount: 0 },
    last15Days: { totalQuantity: 0, totalAmount: 0 },
    last30Days: { totalQuantity: 0, totalAmount: 0 },
  };

  const safeUserStats = userStats || {
    totalUsers: 0,
    customerUsers: 0,
    adminUsers: 0,
    superAdminUsers: 0,
  };

  const revenueChange =
    (((safeOrderStats.last30Days?.totalAmount || 0) -
      (safeOrderStats.last15Days?.totalAmount || 0)) /
      (safeOrderStats.last15Days?.totalAmount || 1)) *
    100;
  const ordersChange =
    (((safeOrderStats.last30Days?.totalQuantity || 0) -
      (safeOrderStats.last15Days?.totalQuantity || 0)) /
      (safeOrderStats.last15Days?.totalQuantity || 1)) *
    100;
  const revenue7vs15Change =
    (((safeOrderStats.last7Days?.totalAmount || 0) -
      (safeOrderStats.last15Days?.totalAmount || 0)) /
      (safeOrderStats.last15Days?.totalAmount || 1)) *
    100;

  const stats = [
    {
      title: "Revenue (7 Days)",
      value: `$${(safeOrderStats.last7Days?.totalAmount || 0).toLocaleString()}`,
      icon: DollarSign,
      description: `${safeOrderStats.last7Days?.totalQuantity || 0} orders`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-100",
      trend: revenue7vs15Change >= 0,
      trendValue: `${Math.abs(revenue7vs15Change).toFixed(1)}%`,
    },
    {
      title: "Revenue (15 Days)",
      value: `$${(safeOrderStats.last15Days?.totalAmount || 0).toLocaleString()}`,
      icon: DollarSign,
      description: `${safeOrderStats.last15Days?.totalQuantity || 0} orders`,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      iconBgColor: "bg-yellow-100",
      trend:
        (safeOrderStats.last15Days?.totalAmount || 0) -
          (safeOrderStats.last7Days?.totalAmount || 0) >=
        0,
      trendValue: `${Math.abs((((safeOrderStats.last15Days?.totalAmount || 0) - (safeOrderStats.last7Days?.totalAmount || 0)) / (safeOrderStats.last7Days?.totalAmount || 1)) * 100).toFixed(1)}%`,
    },
    {
      title: "Revenue (30 Days)",
      value: `$${(safeOrderStats.last30Days?.totalAmount || 0).toLocaleString()}`,
      icon: TrendingUp,
      description: `${safeOrderStats.last30Days?.totalQuantity || 0} orders`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      iconBgColor: "bg-orange-100",
      trend: revenueChange >= 0,
      trendValue: `${Math.abs(revenueChange).toFixed(1)}%`,
    },
    {
      title: "Total Users",
      value: `${safeUserStats.totalUsers || 0}+`,
      icon: Users,
      description: `${safeUserStats.customerUsers || 0} customers`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      iconBgColor: "bg-purple-100",
      trend: true,
      trendValue: "8.2%",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br ${stat.bgColor}`}
          />

          <CardContent className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.iconBgColor} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  stat.trend
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.trend ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.trendValue}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-bold tracking-tight text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {stat.title}
              </div>
              <div className="text-xs text-gray-500 pt-1">
                {stat.description}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
