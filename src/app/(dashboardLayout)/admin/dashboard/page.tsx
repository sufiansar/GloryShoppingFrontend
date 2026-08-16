export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";

import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from"@/components/ui/card";
import { Button } from"@/components/ui/button";

import { Skeleton } from"@/components/ui/skeleton";
import DashboardOverview from"@/components/modules/Admin/Stats/DashboardOverview";
import OrderStatsChart from"@/components/modules/Admin/Stats/OrderStatsChart";
import BestProductsChart from"@/components/modules/Admin/Stats/BestProductsChart";
import CategoryStatsChart from"@/components/modules/Admin/Stats/CategoryStatsChart";
import UserStatsChart from"@/components/modules/Admin/Stats/UserStatsChart";
import {
 getorderStats,
 getAllcencleProducts,
 bestProucts,
 getCategoryStats,
 getUserStats,
} from"@/action/stats/stats.action";
import { getMyProfile } from"@/action/user/user.action";
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
} from"lucide-react";

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
 console.log(res,"Orderstats");
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
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
 Welcome back, {userData?.name?.split(' ')[0] || 'Admin'} <span className="text-xl">👋</span>
 </h1>
 <p className="text-sm text-slate-500 mt-1">
 Manage your users, plans and monitor all activities from one central dashboard
 </p>
 </div>
 <div className="flex items-center gap-4">
 <div className="relative">
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
 <svg xmlns="http://www.w3.org/2000/svg"width="16"height="16"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"><circle cx="11"cy="11"r="8"/><path d="m21 21-4.3-4.3"/></svg>
 </span>
 <input type="text"placeholder="Search"className="w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"/>
 </div>
 </div>
 </div>

 {/* Dashboard Overview Cards */}
 <Suspense fallback={<DashboardSkeleton />}>
 <DashboardOverview orderStats={orderStats} userStats={userStats} />
 </Suspense>

 <div className="grid grid-cols-1 gap-8">
 <Card className="w-full rounded-xl border border-slate-100 bg-white shadow-sm">
 <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
 <div className="space-y-1">
 <CardTitle className="text-xl font-bold text-slate-900">
 Monthly Sales
 </CardTitle>
 <CardDescription className="text-sm font-medium text-slate-500">
 Monthly revenue and sales performance
 </CardDescription>
 </div>
 <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-1.5 ring-1 ring-slate-100">
 <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-primary-custom hover:shadow-sm transition-all">
 <Download className="w-4 h-4"/>
 </button>
 </div>
 </CardHeader>
 <CardContent className="p-4">
 <Suspense fallback={<ChartSkeleton />}>
 <OrderStatsChart data={userStats} />
 </Suspense>
 </CardContent>
 </Card>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <Card className="w-full rounded-xl border border-slate-100 bg-white shadow-sm">
 <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
 <div className="space-y-1">
 <CardTitle className="text-xl font-bold text-slate-900">
 Best Selling Products
 </CardTitle>
 <CardDescription className="text-sm font-medium text-slate-500">
 Top performing items by sales
 </CardDescription>
 </div>
 </CardHeader>
 <CardContent className="p-4">
 <Suspense fallback={<ChartSkeleton />}>
 <BestProductsChart data={bestProducts} />
 </Suspense>
 </CardContent>
 </Card>

 <Card className="w-full rounded-xl border border-slate-100 bg-white shadow-sm">
 <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
 <div className="space-y-1">
 <CardTitle className="text-xl font-bold text-slate-900">
 Category Performance
 </CardTitle>
 <CardDescription className="text-sm font-medium text-slate-500">
 Sales distribution by category
 </CardDescription>
 </div>
 </CardHeader>
 <CardContent className="p-4">
 <Suspense fallback={<ChartSkeleton />}>
 <CategoryStatsChart data={categoryStats} />
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
 <Skeleton className="h-32 w-full rounded-xl"/>
 </CardContent>
 </Card>
 ))}
 </div>
 );
}

function ChartSkeleton() {
 return (
 <div className="space-y-3">
 <Skeleton className="h-75 w-full rounded-xl"/>
 <div className="flex gap-2">
 <Skeleton className="h-8 w-24 rounded-lg"/>
 <Skeleton className="h-8 w-24 rounded-lg"/>
 </div>
 </div>
 );
}

async function NewUserList() {
 const users = [
 { name:"Mamunur Rashid", email:"mamun@glory.com", role:"Super Admin", status:"Active", joined:"Oct 24, 2024", initials:"MR"},
 { name:"Abu Sufian", email:"sufian@glory.com", role:"Admin", status:"Active", joined:"Oct 23, 2024", initials:"AS"},
 { name:"John Doe", email:"john@example.com", role:"User", status:"Inactive", joined:"Oct 20, 2024", initials:"JD"},
 { name:"Alice Brown", email:"alice@example.com", role:"Manager", status:"Active", joined:"Oct 19, 2024", initials:"AB"},
 { name:"Jane Smith", email:"jane@example.com", role:"User", status:"Active", joined:"Oct 18, 2024", initials:"JS"},
 ];

 return (
 <div className="overflow-x-auto scrollbar-hide">
 <table className="w-full min-w-[500px]">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 rounded-l-lg">Name</th>
 <th className="text-left py-4 px-4 text-xs font-bold text-slate-500">Email</th>
 <th className="text-left py-4 px-4 text-xs font-bold text-slate-500">Role</th>
 <th className="text-center py-4 px-4 text-xs font-bold text-slate-500">Status</th>
 <th className="text-right py-4 px-4 text-xs font-bold text-slate-500 rounded-r-lg">Joined</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {users.map((user, index) => (
 <tr
 key={index}
 className="group hover:bg-slate-50/50 transition-all duration-300"
 >
 <td className="py-4 px-4">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
 <span className="text-sm font-bold text-violet-700">{user.initials}</span>
 </div>
 <span className="text-sm font-semibold text-slate-900">
 {user.name}
 </span>
 </div>
 </td>
 <td className="py-4 px-4 text-sm text-slate-500">
 {user.email}
 </td>
 <td className="py-4 px-4 text-sm text-slate-500">
 {user.role}
 </td>
 <td className="py-4 px-4 text-center">
 <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
 user.status ==="Active"
 ?"bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20"
 :"bg-slate-100 text-slate-500 ring-1 ring-slate-200"
 }`}>
 {user.status}
 </span>
 </td>
 <td className="py-4 px-4 text-right text-sm text-slate-500">
 {user.joined}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 );
}
