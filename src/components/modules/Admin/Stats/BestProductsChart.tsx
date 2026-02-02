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

type ProductStat = { productName?: string; totalSold?: number };

export default function BestProductsChart({
  data,
}: {
  data?: ProductStat[] | null;
}) {
  const list = data ?? [];

  const chartData = list?.map((product: any) => ({
    name:
      product.productName?.substring(0, 20) +
      (product.productName?.length > 20 ? "..." : ""),
    sales: product.totalSold ?? 0,
  }));

  return (
    <div className="h-87.5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={90} />
          <Tooltip formatter={(value) => [`${value} units`, "Total Sold"]} />
          <Legend />
          <Bar
            dataKey="sales"
            name="Units Sold"
            fill="#0088FE"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
