"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type OrderStats = {
  last7Days?: { totalOrders?: number; totalRevenue?: number };
  last15Days?: { totalOrders?: number; totalRevenue?: number };
  last30Days?: { totalOrders?: number; totalRevenue?: number };
};

export default function OrderStatsChart({
  data: orderStats,
}: {
  data?: OrderStats | null;
}) {
  const safe = orderStats ?? {};

  const chartData = [
    {
      period: "Last 7 Days",
      orders: safe.last7Days?.totalOrders ?? 0,
      revenue: safe.last7Days?.totalRevenue ?? 0,
    },
    {
      period: "Last 15 Days",
      orders: safe.last15Days?.totalOrders ?? 0,
      revenue: safe.last15Days?.totalRevenue ?? 0,
    },
    {
      period: "Last 30 Days",
      orders: safe.last30Days?.totalOrders ?? 0,
      revenue: safe.last30Days?.totalRevenue ?? 0,
    },
  ];

  return (
    <div className="h-87.5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? value.toLocaleString() : value
            }
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="orders"
            name="Total Orders"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="revenue"
            name="Total Revenue ($)"
            fill="#82ca9d"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
