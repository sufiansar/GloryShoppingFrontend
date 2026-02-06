import { getorderStats, getUserStats } from "@/action/stats/stats.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, Users, DollarSign } from "lucide-react";

export default async function DashboardOverview() {
  const [orderStats, userStats] = await Promise.all([
    getorderStats(),
    getUserStats(),
  ]);

  const stats = [
    {
      title: "Total Revenue (30 Days)",
      value: `$${orderStats?.last30Days?.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: `${(((orderStats?.last30Days?.totalRevenue - orderStats?.last15Days?.totalRevenue) / orderStats?.last15Days?.totalRevenue) * 100).toFixed(1)}% from last period`,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders (30 Days)",
      value: orderStats?.last30Days?.totalOrders.toLocaleString(),
      icon: Package,
      description: `${orderStats?.last7Days?.totalOrders} orders in last 7 days`,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: userStats?.totalUsers?.toLocaleString(),
      icon: Users,
      description: `${userStats?.customerUsers} customers, ${userStats?.adminUsers + userStats?.superAdminUsers} admins`,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Best Period",
      value: "Last 7 Days",
      icon: BarChart3,
      description: `$${orderStats?.last7Days?.totalRevenue.toLocaleString()} revenue`,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={`rounded-3xl border shadow-sm ${
            index === 0
              ? "bg-linear-to-br from-emerald-50 via-white to-emerald-50 border-emerald-100"
              : "bg-white/80"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stat.value}
            </div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border bg-white/70 px-2.5 py-1 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {stat.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
