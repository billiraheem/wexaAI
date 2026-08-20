"use client";

import { X, Bot, GitBranch, ListChecks, Server, ArrowRightLeft, Building2 } from "lucide-react";

const NODE_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Agent: Bot,
  Workflow: GitBranch,
  Task: ListChecks,
  System: Server,
  DataPipeline: ArrowRightLeft,
  Department: Building2,
};

interface NodeDetailSidePanelProps {
  selectedNode: any;
  nodeDetail: Record<string, unknown> | null;
  loadingDetail: boolean;
  onClose: () => void;
  getNodeColor: (label: string) => string;
}

export function NodeDetailSidePanel({
  selectedNode,
  nodeDetail,
  loadingDetail,
  onClose,
  getNodeColor,
}: NodeDetailSidePanelProps) {
  if (!selectedNode) return null;

  const Icon = NODE_ICONS[selectedNode.label];
  const nodeColor = getNodeColor(selectedNode.label);

  return (
    <div
      className="absolute top-0 right-0 w-full sm:w-96 h-full overflow-y-auto animate-scale-in border-l shadow-xl z-20"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: nodeColor + "15" }}
            >
              {Icon && <Icon className="w-5 h-5" style={{ color: nodeColor }} />}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                {selectedNode.label}
              </span>
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                {selectedNode.name}
              </h3>
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

        {loadingDetail ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-4 rounded animate-pulse"
                style={{ backgroundColor: "var(--color-bg-alt)" }}
              />
            ))}
          </div>
        ) : nodeDetail ? (
          <div className="space-y-4">
            {Object.entries(nodeDetail).map(([key, value]) => {
              if (key === "name") return null;
              if (Array.isArray(value) && value.length > 0) {
                return (
                  <div key={key}>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                      {key.replace(/([A-Z])/g, " $1").trim()} ({value.length})
                    </p>
                    <div className="space-y-1.5">
                      {value.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="px-3 py-2 rounded-lg border text-sm"
                          style={{
                            backgroundColor: "var(--color-primary-lighter)",
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {typeof item === "object" ? item.name || JSON.stringify(item) : item}
                          {item.type && (
                            <span className="ml-2 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                              ({item.type})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (value && !Array.isArray(value) && typeof value !== "object") {
                return (
                  <div key={key}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-text-tertiary)" }}>
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      {String(value)}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
