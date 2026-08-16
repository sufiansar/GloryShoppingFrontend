"use client";

import { Card, CardContent } from"@/components/ui/card";
import {
 BarChart3,
 Package,
 Users,
 DollarSign,
 TrendingUp,
 TrendingDown,
} from"lucide-react";
import { motion } from"framer-motion";

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
 title:"Total Users",
 value: (safeUserStats.totalUsers || 12200).toLocaleString(),
 icon: Users,
 description:"Lifetime registered",
 trend:"+12.5%",
 isPositive: true,
 gradient:"from-blue-500/20 to-blue-600/20",
 iconColor:"text-blue-500",
 accent:"bg-blue-500",
 },
 {
 title:"Active Users",
 value:"8,400",
 icon: Users,
 description:"Current active users",
 trend:"+5.2%",
 isPositive: true,
 gradient:"from-purple-500/20 to-purple-600/20",
 iconColor:"text-purple-500",
 accent:"bg-purple-500",
 },
 {
 title:"New signups",
 value:"1,200",
 icon: Users,
 description:"Signups this week",
 trend:"+15.3%",
 isPositive: true,
 gradient:"from-emerald-500/20 to-emerald-600/20",
 iconColor:"text-emerald-500",
 accent:"bg-emerald-500",
 },
 {
 title:"Conversion Rate",
 value:"85%",
 icon: BarChart3,
 description:"User to customer",
 trend:"+2.4%",
 isPositive: true,
 gradient:"from-orange-500/20 to-orange-600/20",
 iconColor:"text-orange-500",
 accent:"bg-orange-500",
 },
 ];

 return (
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
 {stats.map((stat, index) => (
 <motion.div
 key={stat.title}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3, delay: index * 0.1 }}
 >
 <Card className="flex flex-row items-center justify-between overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
 <div className="flex flex-col gap-2">
 <h3 className="text-sm font-semibold text-slate-500">
 {stat.title}
 </h3>
 <span className="text-3xl font-bold text-slate-900">
 {stat.value}
 </span>
 </div>
 
 <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.accent}/10 ${stat.iconColor}`}>
 <stat.icon className="h-6 w-6"/>
 </div>
 </Card>
 </motion.div>
 ))}
 </div>
 );
}
