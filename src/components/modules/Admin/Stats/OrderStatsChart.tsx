"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
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
      time: "10am",
      value: Math.round((safe.last7Days?.totalOrders ?? 0) * 0.3),
    },
    {
      time: "11am",
      value: Math.round((safe.last7Days?.totalOrders ?? 0) * 0.5),
    },
    {
      time: "12am",
      value: Math.round((safe.last7Days?.totalOrders ?? 0) * 0.4),
    },
    {
      time: "01am",
      value: Math.round((safe.last15Days?.totalOrders ?? 0) * 0.6),
    },
    {
      time: "02am",
      value: Math.round((safe.last15Days?.totalOrders ?? 0) * 0.45),
    },
    {
      time: "03am",
      value: Math.round((safe.last15Days?.totalOrders ?? 0) * 0.7),
    },
    {
      time: "04am",
      value: Math.round((safe.last30Days?.totalOrders ?? 0) * 0.5),
    },
    {
      time: "05am",
      value: Math.round((safe.last30Days?.totalOrders ?? 0) * 0.8),
    },
    {
      time: "06am",
      value: Math.round((safe.last30Days?.totalOrders ?? 0) * 0.6),
    },
    {
      time: "07am",
      value: Math.round((safe.last30Days?.totalOrders ?? 0) * 0.9),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-sm">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={3}
            fill="url(#colorValue)"
            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#8b5cf6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
