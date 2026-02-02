"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function UserStatsChart({ data }: { data?: any | null }) {
  const stats = data ?? { customerUsers: 0, adminUsers: 0, superAdminUsers: 0 };

  const chartData = [
    { name: "Customers", value: stats.customerUsers ?? 0, fill: "#0088FE" },
    { name: "Admins", value: stats.adminUsers ?? 0, fill: "#00C49F" },
    {
      name: "Super Admins",
      value: stats.superAdminUsers ?? 0,
      fill: "#FFBB28",
    },
  ];

  return (
    <div className="h-87.5">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="10%"
          outerRadius="80%"
          data={chartData}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            label={{ position: "insideStart", fill: "#fff" }}
            background
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
