"use client";

import { Route, Loader2 } from "lucide-react";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Combobox, ComboboxOption } from "@/components/ui/Combobox";

interface ShortestPathTabProps {
  pathFrom: string;
  pathTo: string;
  onPathFromChange: (val: string) => void;
  onPathToChange: (val: string) => void;
  onFindPath: () => void;
  loadingPath: boolean;
  pathResult: any;
  allNodes?: ComboboxOption[];
}

export function ShortestPathTab({
  pathFrom,
  pathTo,
  onPathFromChange,
  onPathToChange,
  onFindPath,
  loadingPath,
  pathResult,
  allNodes = [],
}: ShortestPathTabProps) {
  return (
    <div>
      <div
        className="rounded-2xl border p-6 mb-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
          <Route className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          Shortest Path Finder
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Find the shortest dependency chain between any two named entities in the graph.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Combobox
            options={allNodes}
            value={pathFrom}
            onChange={onPathFromChange}
            placeholder="From (e.g. Salesforce CRM)"
          />
          <Combobox
            options={allNodes}
            value={pathTo}
            onChange={onPathToChange}
            placeholder="To (e.g. Payroll Processing Agent)"
          />
        </div>
        <button
          onClick={onFindPath}
          disabled={!pathFrom || !pathTo || loadingPath}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-inverse)",
          }}
        >
          {loadingPath ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Route className="w-4 h-4" />
          )}
          Find Path
        </button>
      </div>

      {loadingPath && <TableSkeleton rows={3} />}

      {pathResult && !loadingPath && (
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3 className="text-sm font-medium mb-4" style={{ color: "var(--color-text)" }}>
            Path found — {pathResult.length} hop{pathResult.length !== 1 ? "s" : ""}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {pathResult.path.map((seg: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                {i === 0 && (
                  <div
                    className="px-3 py-2 rounded-xl border"
                    style={{
                      backgroundColor: "var(--color-primary-light)",
                      borderColor: "var(--color-primary)",
                    }}
                  >
                    <span className="text-[10px] block uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                      {seg.startNode.label}
                    </span>
                    <span className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                      {seg.startNode.name}
                    </span>
                  </div>
                )}
                <div
                  className="px-2 py-1 text-[10px] rounded-lg border font-mono"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {seg.relationship}
                </div>
                <div
                  className="px-3 py-2 rounded-xl border"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    borderColor: "var(--color-primary)",
                  }}
                >
                  <span className="text-[10px] block uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                    {seg.endNode.label}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                    {seg.endNode.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!pathResult && !loadingPath && (
        <EmptyState
          title="Search for a path"
          description="Type or select the names of any two entities to find the shortest path between them."
          icon={<Route className="w-10 h-10" style={{ color: "var(--color-text-tertiary)" }} />}
        />
      )}
    </div>
  );
}
