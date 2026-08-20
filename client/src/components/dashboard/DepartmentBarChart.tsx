"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DepartmentBarChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
  subtitle: string;
}

export function DepartmentBarChart({ data, title, subtitle }: DepartmentBarChartProps) {
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

      <div className="w-full h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "var(--color-text)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              cursor={{ fill: "var(--color-primary-lighter)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
