"use client";

import { Bot, X, GitBranch, ListChecks, Server } from "lucide-react";

interface AgentDetailDrawerProps {
  agent: any;
  loading: boolean;
  onClose: () => void;
}

export function AgentDetailDrawer({
  agent,
  loading,
  onClose,
}: AgentDetailDrawerProps) {
  if (!agent && !loading) return null;

  return (
    <div className="w-full lg:w-96 shrink-0">
      <div
        className="sticky top-20 rounded-2xl border p-6 animate-scale-in"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl"
              style={{ backgroundColor: "var(--color-primary-light)" }}
            >
              <Bot className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                {agent?.name}
              </h3>
              <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                {agent?.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 transition-colors hover:opacity-80 cursor-pointer"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-4 rounded animate-pulse"
                style={{ backgroundColor: "var(--color-bg)" }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-text-tertiary)" }}>
                Status
              </p>
              <span
                className="px-2 py-0.5 text-xs font-medium rounded-full border"
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

            <div>
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                Assigned Workflows ({agent.workflows?.length || 0})
              </p>
              <div className="space-y-1.5">
                {agent.workflows?.map((w: any) => (
                  <div
                    key={w.name}
                    className="px-3 py-2 rounded-lg border text-sm flex items-center justify-between"
                    style={{
                      backgroundColor: "var(--color-primary-lighter)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <GitBranch className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
                      {w.name}
                    </span>
                    {w.category && (
                      <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                        {w.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                Executed Tasks ({agent.tasks?.length || 0})
              </p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {agent.tasks?.map((t: any) => (
                  <div
                    key={t.name}
                    className="px-3 py-2 rounded-lg border text-sm flex items-center justify-between"
                    style={{
                      backgroundColor: "var(--color-bg)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <ListChecks className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                      {t.name}
                    </span>
                    {t.avgDurationMinutes && (
                      <span className="text-xs font-mono" style={{ color: "var(--color-text-tertiary)" }}>
                        {t.avgDurationMinutes}m
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {agent.systems?.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                  Integrated Systems ({agent.systems.length})
                </p>
                <div className="space-y-1.5">
                  {agent.systems.map((s: any) => (
                    <div
                      key={s.name}
                      className="px-3 py-2 rounded-lg border text-sm flex items-center justify-between"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <Server className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
                        {s.name}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                        {s.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
