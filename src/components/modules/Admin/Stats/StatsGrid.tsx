import { getorderStats } from "@/action/stats/stats.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsGridProps {
  period?: "7days" | "15days" | "30days";
}

export default async function StatsGrid({ period = "30days" }: StatsGridProps) {
  const orderStats = await getorderStats();

  const statsData = {
    "7days": orderStats.last7Days,
    "15days": orderStats.last15Days,
    "30days": orderStats.last30Days,
  };

  const data = statsData[period];

  const metrics = [
    {
      title: "Average Order Value",
      value: `$${(data.totalRevenue / Math.max(data.totalOrders, 1)).toFixed(2)}`,
      description: "Revenue per order",
    },
    {
      title: "Conversion Rate",
      value: "N/A",
      description: "Based on total traffic",
    },
    {
      title: "Returning Customers",
      value: "N/A",
      description: "Percentage of repeat customers",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Order Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{data.totalOrders}</div>
          <p className="text-sm text-muted-foreground">
            Total orders in period
          </p>
        </CardContent>
      </Card>

      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
