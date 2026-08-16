"use client";

import { Card } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardOverviewProps {
  orderStats?: {
    last7Days?: { totalQuantity: number; totalAmount: number };
    last15Days?: { totalQuantity: number; totalAmount: number };
    last30Days?: { totalQuantity: number; totalAmount: number };
  } | null;
  userStats?: any;
}

export default function DashboardOverview({
  orderStats,
  userStats,
}: DashboardOverviewProps) {
  const safeOrderStats = orderStats || {};
  const safeUserStats = userStats || {};

  // Dynamically extract values from backend response structure safely
  const totalUsers =
    safeUserStats.totalUsers ??
    safeUserStats.total ??
    safeUserStats.count ??
    0;

  const customerUsers =
    safeUserStats.customerUsers ??
    safeUserStats.customer ??
    safeUserStats.customers ??
    safeUserStats.user ??
    0;

  const newSignups =
    safeUserStats.newSignups ??
    safeUserStats.newUsers ??
    safeUserStats.recentSignups ??
    safeUserStats.last7DaysUsers ??
    safeUserStats.adminUsers ??
    0;

  const totalRevenue =
    safeOrderStats.last30Days?.totalAmount ??
    (safeOrderStats as any).totalAmount ??
    0;

  const stats = [
    {
      title: "Total Users",
      value: Number(totalUsers).toLocaleString(),
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-100",
    },
    {
      title: "Active Customers",
      value: Number(customerUsers).toLocaleString(),
      icon: UserCheck,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-100",
    },
    {
      title: "New Signups",
      value: Number(newSignups).toLocaleString(),
      icon: UserPlus,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-100",
    },
    {
      title: "Revenue (30 Days)",
      value: `৳${Number(totalRevenue).toLocaleString()}`,
      icon: DollarSign,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50 border-rose-100",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="flex flex-row items-center justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md transition-all">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.title}
              </h3>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </span>
            </div>

            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${stat.bgColor} ${stat.iconColor}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
