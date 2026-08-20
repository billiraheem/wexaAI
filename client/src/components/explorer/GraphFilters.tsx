"use client";

import { Filter, Bot, GitBranch, ListChecks, Server, ArrowRightLeft, Building2 } from "lucide-react";

const NODE_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Agent: Bot,
  Workflow: GitBranch,
  Task: ListChecks,
  System: Server,
  DataPipeline: ArrowRightLeft,
  Department: Building2,
};

const NODE_COLORS: Record<string, { light: string; dark: string }> = {
  Agent: { light: "#7C1D2E", dark: "#D4567E" },
  Workflow: { light: "#4A6FA5", dark: "#60A5FA" },
  Task: { light: "#2D7A4F", dark: "#4ADE80" },
  System: { light: "#B8860B", dark: "#F59E0B" },
  DataPipeline: { light: "#C4416A", dark: "#E88AA0" },
  Department: { light: "#6B6560", dark: "#A09890" },
};

interface GraphFiltersProps {
  labelFilters: string[];
  activeFilters: Set<string>;
  onToggleFilter: (label: string) => void;
  isDark: boolean;
}

export function GraphFilters({ labelFilters, activeFilters, onToggleFilter, isDark }: GraphFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-tertiary)" }} />
      {labelFilters.map((label) => {
        const isActive = activeFilters.has(label);
        const Icon = NODE_ICONS[label];
        const colorObj = NODE_COLORS[label];
        const color = colorObj ? (isDark ? colorObj.dark : colorObj.light) : "#666";

        return (
          <button
            key={label}
            onClick={() => onToggleFilter(label)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer"
            style={{
              backgroundColor: isActive ? "var(--color-primary-light)" : "var(--color-surface)",
              borderColor: isActive ? "var(--color-primary)" + "30" : "var(--color-border)",
              color: isActive ? "var(--color-primary)" : "var(--color-text-tertiary)",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: isActive ? color : "var(--color-border)" }}
            />
            {Icon && <Icon className="w-3 h-3" />}
            {label === "DataPipeline" ? "Pipeline" : label}
          </button>
        );
      })}
    </div>
  );
}
