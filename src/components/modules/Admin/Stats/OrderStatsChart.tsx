"use client";

import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
} from"recharts";

export default function OrderStatsChart({
 data,
}: {
 data?: any;
}) {
 const safe = data ?? {};
 const monthlySales = safe.monthlySales || {
 Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
 };

 // Using beautiful mock data to show the bar chart shape for design purposes
 const chartData = [
 { time:"Jan", value: monthlySales?.Jan ?? 0 },
 { time:"Feb", value: monthlySales?.Feb ?? 0 },
 { time:"Mar", value: monthlySales?.Mar ?? 0 },
 { time:"Apr", value: monthlySales?.Apr ?? 0 },
 { time:"May", value: monthlySales?.May ?? 0 },
 { time:"Jun", value: monthlySales?.Jun ?? 0 },
 { time:"Jul", value: monthlySales?.Jul ?? 0 },
 { time:"Aug", value: monthlySales?.Aug ?? 0 },
 { time:"Sep", value: monthlySales?.Sep ?? 0 },
 { time:"Oct", value: monthlySales?.Oct ?? 0 },
 { time:"Nov", value: monthlySales?.Nov ?? 0 },
 { time:"Dec", value: monthlySales?.Dec ?? 0 },
 ];

 const CustomTooltip = ({ active, payload }: any) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-white text-slate-900 px-4 py-2 rounded-lg shadow-xl border border-slate-100">
 <p className="font-semibold text-sm">Sales: {payload[0].value}</p>
 </div>
 );
 }
 return null;
 };

 return (
 <div className="h-80 w-full mt-4">
 <ResponsiveContainer width="100%"height="100%">
 <BarChart
 data={chartData}
 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
 barSize={32}
 >
 <CartesianGrid
 strokeDasharray="3 3"
 stroke="#f1f5f9"
 vertical={false}
 />
 <XAxis
 dataKey="time"
 axisLine={false}
 tickLine={false}
 tick={{ fill:"#94a3b8", fontSize: 12 }}
 dy={10}
 />
 <YAxis
 axisLine={false}
 tickLine={false}
 tick={{ fill:"#94a3b8", fontSize: 12 }}
 />
 <Tooltip content={<CustomTooltip />} cursor={{ fill:"#fdf2f8"}} />
 <Bar 
 dataKey="value"
 fill="#c25891"
 radius={[6, 6, 0, 0]} 
 />
 </BarChart>
 </ResponsiveContainer>
 </div>
 );
}
