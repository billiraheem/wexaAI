"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryPieChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
  subtitle: string;
}

export function CategoryPieChart({ data, title, subtitle }: CategoryPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col justify-between"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div>
        <h3 className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-text)" }}>
          {title}
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-tertiary)" }}>
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-32 h-32 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
                nameKey="label"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "var(--color-text)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                itemStyle={{ color: "var(--color-text)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm font-bold leading-none" style={{ color: "var(--color-text)" }}>
              {total}
            </span>
            <span className="text-[9px] uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
              Total
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2 min-w-0">
          {data.map((d) => (
            <div key={d.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="truncate" style={{ color: "var(--color-text-secondary)" }}>
                  {d.label}
                </span>
              </div>
              <span className="font-mono font-medium ml-2" style={{ color: "var(--color-text)" }}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
