"use client";

import {
 PieChart,
 Pie,
 Cell,
 ResponsiveContainer,
 Tooltip,
 Legend,
} from"recharts";

const COLORS = ["#3b82f6","#f59e0b","#ef4444"];

export default function UserStatsChart({ data }: { data?: any | null }) {
 const stats = data ?? { customerUsers: 0, adminUsers: 0, superAdminUsers: 0 };

 const total =
 (stats.customerUsers ?? 0) +
 (stats.adminUsers ?? 0) +
 (stats.superAdminUsers ?? 0);

 const chartData = [
 {
 name:"Sale",
 value: stats.customerUsers ?? 0,
 fill: COLORS[0],
 percentage:
 total > 0 ? (((stats.customerUsers ?? 0) / total) * 100).toFixed(0) : 0,
 },
 {
 name:"Distribute",
 value: stats.adminUsers ?? 0,
 fill: COLORS[1],
 percentage:
 total > 0 ? (((stats.adminUsers ?? 0) / total) * 100).toFixed(0) : 0,
 },
 {
 name:"Return",
 value: stats.superAdminUsers ?? 0,
 fill: COLORS[2],
 percentage:
 total > 0
 ? (((stats.superAdminUsers ?? 0) / total) * 100).toFixed(0)
 : 0,
 },
 ];

 const mainPercentage =
 total > 0 ? (((stats.customerUsers ?? 0) / total) * 100).toFixed(0) : 0;

 const CustomTooltip = ({ active, payload }: any) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
 <p className="font-semibold text-sm text-gray-900">
 {payload[0].name}
 </p>
 <p className="text-sm text-gray-600">
 {payload[0].value} ({payload[0].payload.percentage}%)
 </p>
 </div>
 );
 }
 return null;
 };

 return (
 <div className="h-80 flex items-center justify-between">
 <ResponsiveContainer width="60%"height="100%">
 <PieChart>
 <Pie
 data={chartData}
 cx="50%"
 cy="50%"
 innerRadius={80}
 outerRadius={120}
 paddingAngle={2}
 dataKey="value"
 >
 {chartData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.fill} />
 ))}
 </Pie>
 <Tooltip content={<CustomTooltip />} />
 <text
 x="50%"
 y="45%"
 textAnchor="middle"
 dominantBaseline="middle"
 className="text-5xl font-bold"
 fill="#1f2937"
 >
 {mainPercentage}%
 </text>
 <text
 x="50%"
 y="58%"
 textAnchor="middle"
 dominantBaseline="middle"
 className="text-sm"
 fill="#6b7280"
 >
 Transactions
 </text>
 </PieChart>
 </ResponsiveContainer>

 <div className="flex-1 space-y-4 px-4">
 {chartData.map((item, index) => (
 <div key={index} className="flex items-center gap-3">
 <div
 className="w-3 h-3 rounded-full"
 style={{ backgroundColor: item.fill }}
 />
 <div className="flex-1">
 <div className="flex items-center justify-between">
 <span className="text-sm font-medium text-gray-700">
 {item.name}
 </span>
 <span className="text-xs text-gray-500">{item.value}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
