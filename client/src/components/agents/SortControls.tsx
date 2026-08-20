"use client";

import { ArrowUpDown } from "lucide-react";

interface SortControlsProps {
  sortBy: "tasks" | "workflows";
  onSortChange: (sort: "tasks" | "workflows") => void;
}

export function SortControls({ sortBy, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      <ArrowUpDown className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-tertiary)" }} />
      <span className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>Sort by:</span>
      <button
        onClick={() => onSortChange("tasks")}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer"
        style={{
          backgroundColor: sortBy === "tasks" ? "var(--color-primary-light)" : "var(--color-surface)",
          borderColor: sortBy === "tasks" ? "var(--color-primary)" : "var(--color-border)",
          color: sortBy === "tasks" ? "var(--color-primary)" : "var(--color-text-tertiary)",
        }}
      >
        Task Count
      </button>
      <button
        onClick={() => onSortChange("workflows")}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer"
        style={{
          backgroundColor: sortBy === "workflows" ? "var(--color-primary-light)" : "var(--color-surface)",
          borderColor: sortBy === "workflows" ? "var(--color-primary)" : "var(--color-border)",
          color: sortBy === "workflows" ? "var(--color-primary)" : "var(--color-text-tertiary)",
        }}
      >
        Workflow Count
      </button>
    </div>
  );
}
