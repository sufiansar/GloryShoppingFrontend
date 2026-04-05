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

  const stats = [
    {
      title: "Weekly Revenue",
      value: `$${(safeOrderStats.last7Days?.totalAmount || 0).toLocaleString()}`,
      icon: DollarSign,
      description: `${safeOrderStats.last7Days?.totalQuantity || 0} New Orders`,
      gradient: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-500/20",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+12.5%",
      isPositive: true,
    },
    {
      title: "Total Customers",
      value: `${(safeUserStats.totalUsers || 0).toLocaleString()}`,
      icon: Users,
      description: "Active users this month",
      gradient: "from-purple-600 to-pink-600",
      shadow: "shadow-purple-500/20",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "+8.2%",
      isPositive: true,
    },
    {
      title: "Monthly Volume",
      value: `${(safeOrderStats.last30Days?.totalQuantity || 0).toLocaleString()}`,
      icon: Package,
      description: "Items processed",
      gradient: "from-orange-500 to-rose-500",
      shadow: "shadow-orange-500/20",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      trend: ordersChange >= 0 ? `+${ordersChange.toFixed(1)}%` : `${ordersChange.toFixed(1)}%`,
      isPositive: ordersChange >= 0,
    },
    {
      title: "Net Revenue",
      value: `$${(safeOrderStats.last30Days?.totalAmount || 0).toLocaleString()}`,
      icon: BarChart3,
      description: "Last 30 days total",
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: revenueChange >= 0 ? `+${revenueChange.toFixed(1)}%` : `${revenueChange.toFixed(1)}%`,
      isPositive: revenueChange >= 0,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="group relative overflow-hidden rounded-[2rem] border-0 bg-white p-1 shadow-xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl active:scale-95"
        >
          <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br transition-all duration-500 group-hover:scale-150 opacity-10 ${stat.gradient}`} />
          
          <CardContent className="relative flex flex-col justify-between p-6 h-full">
            <div className="flex items-center justify-between mb-8">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.iconColor} shadow-inner transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black tracking-tight ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} ring-1 ring-inset ${stat.isPositive ? 'ring-emerald-600/10' : 'ring-rose-600/10'}`}>
                {stat.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.trend}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-500">
                {stat.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-900">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400">
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
