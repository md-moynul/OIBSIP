// components/dashboard/OverviewBarChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataItem {
  label: string;
  value: number;
}

interface OverviewBarChartProps {
  data: ChartDataItem[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-background p-3 shadow-lg">
        <p className="text-xs font-semibold text-text-muted">
          {payload[0].payload.label}
        </p>
        <p className="mt-1 font-mono text-sm font-bold text-primary">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function OverviewBarChart({ data }: OverviewBarChartProps) {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
      <div className="mb-6">
        <h2 className="font-display text-lg font-semibold text-text">
          Platform Activity
        </h2>
        <p className="text-xs text-text-muted">
          Visualizing distribution across core resources
        </p>
      </div>

      <div className="h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border/40"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              className="text-xs font-medium fill-text-muted"
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs font-mono fill-text-muted"
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--primary)", opacity: 0.05 }} />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))" // CSS variable mapping to matches HeroUI or custom tailwind colors
              className="fill-primary"
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}