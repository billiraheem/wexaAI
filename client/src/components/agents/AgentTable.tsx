"use client";

import { useState } from "react";

interface AgentItem {
  name: string;
  role: string;
  status: string;
  taskCount: number;
  workflowCount: number;
}

interface AgentTableProps {
  agents: AgentItem[];
  maxTasks: number;
  selectedAgentName?: string;
  onAgentClick: (agentName: string) => void;
  pageOffset?: number;
}

export function AgentTable({
  agents,
  maxTasks,
  selectedAgentName,
  onAgentClick,
  pageOffset = 0,
}: AgentTableProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Table Header */}
      <div
        className="grid grid-cols-[2fr_1fr_1fr_0.5fr] gap-4 px-5 py-3 border-b text-xs font-medium uppercase tracking-wider"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-tertiary)",
        }}
      >
        <span>Agent</span>
        <span>Tasks</span>
        <span className="text-center">Workflows</span>
        <span>Status</span>
      </div>

      {/* Table Rows */}
      <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
        {agents.map((agent, index) => {
          const isSelected = selectedAgentName === agent.name;
          const isHovered = hoveredIndex === index;
          return (
            <button
              key={agent.name}
              onClick={() => onAgentClick(agent.name)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="w-full grid grid-cols-[2fr_1fr_1fr_0.5fr] gap-4 px-5 py-4 text-left items-center transition-colors duration-150 cursor-pointer border-b"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: isSelected
                  ? "var(--color-primary-lighter)"
                  : isHovered
                    ? "var(--color-surface-hover)"
                    : "transparent",
              }}
            >
              {/* Agent info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                  }}
                >
                  {pageOffset + index + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                    {agent.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--color-text-tertiary)" }}>
                    {agent.role}
                  </p>
                </div>
              </div>

              {/* Tasks Progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-bg)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(agent.taskCount / maxTasks) * 100}%`,
                      backgroundColor: "var(--color-primary)",
                    }}
                  />
                </div>
                <span className="text-sm font-mono w-6 text-right" style={{ color: "var(--color-text)" }}>
                  {agent.taskCount}
                </span>
              </div>

              {/* Workflows Count - Center Aligned */}
              <div className="flex items-center justify-center">
                <span className="text-sm font-mono font-medium" style={{ color: "var(--color-text)" }}>
                  {agent.workflowCount}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center">
                <span
                  className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full border"
                  style={{
                    backgroundColor:
                      agent.status === "active" ? "rgba(45, 122, 79, 0.1)" : "var(--color-bg)",
                    borderColor:
                      agent.status === "active" ? "rgba(45, 122, 79, 0.3)" : "var(--color-border)",
                    color:
                      agent.status === "active" ? "var(--color-success)" : "var(--color-text-tertiary)",
                  }}
                >
                  {agent.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
