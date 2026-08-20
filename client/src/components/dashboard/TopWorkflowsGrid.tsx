"use client";

import Link from "next/link";
import { GitBranch, ListChecks, Bot, ArrowRight } from "lucide-react";
import { CardSkeleton } from "@/components/ui/Skeleton";

const DEPT_COLORS: Record<string, string> = {
  "Customer Success": "#D4567E",
  Finance: "#B8860B",
  Financial: "#B8860B",
  "IT & Engineering": "#4A6FA5",
  IT: "#4A6FA5",
  "Human Resources": "#C4416A",
  HR: "#C4416A",
  Marketing: "#9B2842",
  "Supply Chain": "#2D7A4F",
  Operations: "#B8860B",
  Unassigned: "#9C9590",
};

interface WorkflowItem {
  name: string;
  category: string;
  department: string;
  taskCount: number;
  agentCount: number;
}

interface TopWorkflowsGridProps {
  workflows: WorkflowItem[] | undefined;
  loading: boolean;
}

export function TopWorkflowsGrid({ workflows, loading }: TopWorkflowsGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
            Top Workflows
          </h2>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            Busiest automated processes by task count
          </p>
        </div>
        <Link
          href="/explorer"
          className="text-xs flex items-center gap-1 transition-colors hover:opacity-80"
          style={{ color: "var(--color-primary)" }}
        >
          View Graph <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : workflows?.map((wf) => {
              const deptColor = DEPT_COLORS[wf.department] || DEPT_COLORS.Unassigned;
              return (
                <div
                  key={wf.name}
                  className="rounded-2xl border p-5 transition-all duration-300 group hover:shadow-sm"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: "var(--color-primary-lighter)" }}
                    >
                      <GitBranch className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                    </div>
                    <span
                      className="px-2 py-0.5 text-[10px] font-medium rounded-full border"
                      style={{
                        color: deptColor,
                        borderColor: deptColor + "40",
                        backgroundColor: deptColor + "10",
                      }}
                    >
                      {wf.department}
                    </span>
                  </div>
                  <h3
                    className="text-sm font-semibold mb-2 leading-tight transition-colors"
                    style={{ color: "var(--color-text)" }}
                  >
                    {wf.name}
                  </h3>
                  <div className="flex gap-4 text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                    <span className="flex items-center gap-1">
                      <ListChecks className="w-3 h-3" />
                      {wf.taskCount} tasks
                    </span>
                    <span className="flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      {wf.agentCount} agents
                    </span>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
