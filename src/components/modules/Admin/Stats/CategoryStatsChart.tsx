"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#ca428b",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

export default function CategoryStatsChart({ data }: { data?: any[] | null }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-medium">
        No category sales data available
      </div>
    );
  }

  // Map and sort categories by total sold
  const formattedData = data
    .map((category: any) => ({
      name: category.categoryName || category.name || "Category",
      value: Number(category.totalSold || category._count?.products || 0),
    }))
    .sort((a, b) => b.value - a.value);

  // Take top 5 categories, group the rest as "Others"
  const topCategories = formattedData.slice(0, 5);
  const remainingCategories = formattedData.slice(5);

  const chartData = [...topCategories];

  if (remainingCategories.length > 0) {
    const othersValue = remainingCategories.reduce((sum, item) => sum + item.value, 0);
    if (othersValue > 0) {
      chartData.push({
        name: "Others",
        value: othersValue,
      });
    }
  }

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      <div className="h-56 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: any) => [`${val} units`, "Total Sold"]}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {totalValue === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-400 pointer-events-none">
            No Sales Yet
          </div>
        )}
      </div>

      {/* Clean Custom Legend Grid */}
      <div className="w-full max-h-28 overflow-y-auto pr-1 grid grid-cols-2 gap-2 text-xs">
        {chartData.map((entry, index) => {
          const percent = totalValue > 0 ? Math.round((entry.value / totalValue) * 100) : 0;
          return (
            <div
              key={entry.name}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100/80"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-semibold text-slate-700 truncate" title={entry.name}>
                  {entry.name}
                </span>
              </div>
              <span className="font-bold text-slate-900 shrink-0 ml-1">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
