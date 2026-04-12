"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";

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
      gradient: "from-blue-500/20 to-indigo-500/20",
      accent: "bg-blue-500",
      iconColor: "text-blue-500",
      trend: "+12.5%",
      isPositive: true,
    },
    {
      title: "Total Customers",
      value: `${(safeUserStats.totalUsers || 0).toLocaleString()}`,
      icon: Users,
      description: "Active users this month",
      gradient: "from-purple-500/20 to-pink-500/20",
      accent: "bg-purple-500",
      iconColor: "text-purple-500",
      trend: "+8.2%",
      isPositive: true,
    },
    {
      title: "Monthly Volume",
      value: `${(safeOrderStats.last30Days?.totalQuantity || 0).toLocaleString()}`,
      icon: Package,
      description: "Items processed",
      gradient: "from-orange-500/20 to-rose-500/20",
      accent: "bg-orange-500",
      iconColor: "text-orange-500",
      trend: ordersChange >= 0 ? `+${ordersChange.toFixed(1)}%` : `${ordersChange.toFixed(1)}%`,
      isPositive: ordersChange >= 0,
    },
    {
      title: "Net Revenue",
      value: `$${(safeOrderStats.last30Days?.totalAmount || 0).toLocaleString()}`,
      icon: BarChart3,
      description: "Last 30 days total",
      gradient: "from-emerald-500/20 to-teal-500/20",
      accent: "bg-emerald-500",
      iconColor: "text-emerald-500",
      trend: revenueChange >= 0 ? `+${revenueChange.toFixed(1)}%` : `${revenueChange.toFixed(1)}%`,
      isPositive: revenueChange >= 0,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="group relative overflow-hidden rounded-[2.5rem] border-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-1 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-20px_rgba(194,88,145,0.15)] ring-1 ring-white/50 dark:ring-slate-800/50 card-shine">
            <div className={`absolute -right-6 -top-6 h-32 w-32 rounded-full bg-linear-to-br ${stat.gradient} blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-40 opacity-20`} />
            
            <CardContent className="relative flex flex-col justify-between p-7 h-full">
              <div className="flex items-center justify-between mb-10">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${stat.iconColor}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black tracking-tight ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'} ring-1 ring-inset ${stat.isPositive ? 'ring-emerald-500/20' : 'ring-rose-500/20'}`}>
                  {stat.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.trend}
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary-custom transition-colors duration-300">
                  {stat.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter text-slate-800 dark:text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${stat.accent} animate-pulse`} />
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
