"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  sublabel: string;
  value: number;
  max: number;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ label, value, max, icon: Icon, color }: StatCardProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const radius = 32;
  const circumference = Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className="rounded-2xl border p-4 transition-all duration-300 group hover:shadow-sm"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="p-2 rounded-xl"
          style={{ backgroundColor: "var(--color-primary-lighter)" }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>

        {/* Mini gauge arc */}
        <svg width="60" height="36" viewBox="0 0 80 48" className="shrink-0">
          <path
            d="M 8 44 A 32 32 0 0 1 72 44"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 8 44 A 32 32 0 0 1 72 44"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <text
            x="40"
            y="42"
            textAnchor="middle"
            fill="var(--color-text)"
            fontSize="13"
            fontWeight="bold"
          >
            {pct}%
          </text>
        </svg>
      </div>

      <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--color-text)" }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        {label}
      </p>
    </div>
  );
}
