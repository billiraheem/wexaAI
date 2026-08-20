"use client";

import { Link2, Loader2, Server, ListChecks } from "lucide-react";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectDropdown } from "@/components/ui/SelectDropdown";

interface SharedDepsTabProps {
  workflows: Array<{ name: string }> | undefined;
  loadingWorkflows: boolean;
  workflow1: string;
  workflow2: string;
  onWorkflow1Change: (wf: string) => void;
  onWorkflow2Change: (wf: string) => void;
  onFindShared: () => void;
  loadingShared: boolean;
  sharedDeps: any[] | null;
}

export function SharedDepsTab({
  workflows,
  loadingWorkflows,
  workflow1,
  workflow2,
  onWorkflow1Change,
  onWorkflow2Change,
  onFindShared,
  loadingShared,
  sharedDeps,
}: SharedDepsTabProps) {
  const workflowOptions1 = loadingWorkflows
    ? [{ value: "", label: "Loading..." }]
    : (workflows || []).map((w) => ({ value: w.name, label: w.name }));

  const workflowOptions2 = loadingWorkflows
    ? [{ value: "", label: "Loading..." }]
    : (workflows || [])
        .filter((w) => w.name !== workflow1)
        .map((w) => ({ value: w.name, label: w.name }));

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
          <Link2 className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          Shared Dependency Finder
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Find systems or tasks that two workflows both depend on — hidden coupling that could cause cascading failures.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <SelectDropdown
            options={workflowOptions1}
            value={workflow1}
            onChange={onWorkflow1Change}
            placeholder="Workflow 1..."
            disabled={loadingWorkflows}
          />
          <SelectDropdown
            options={workflowOptions2}
            value={workflow2}
            onChange={onWorkflow2Change}
            placeholder="Workflow 2..."
            disabled={loadingWorkflows}
          />
        </div>
        <button
          onClick={onFindShared}
          disabled={!workflow1 || !workflow2 || loadingShared}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-inverse)",
          }}
        >
          {loadingShared ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
          Find Shared Dependencies
        </button>
      </div>

      {loadingShared && <TableSkeleton rows={3} />}

      {sharedDeps && !loadingShared && (
        <>
          {sharedDeps.length === 0 ? (
            <EmptyState
              title="No shared dependencies"
              description="These two workflows don't share any common systems or tasks."
            />
          ) : (
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: "var(--color-border)" }}>
                <h3 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  {sharedDeps.length} shared dependencies between{" "}
                  <span style={{ color: "var(--color-primary)" }}>{workflow1}</span> and{" "}
                  <span style={{ color: "var(--color-primary)" }}>{workflow2}</span>
                </h3>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                {sharedDeps.map((dep) => (
                  <div key={dep.name} className="flex items-center gap-4 px-4 py-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--color-primary-light)" }}
                    >
                      {dep.nodeType === "System" ? (
                        <Server className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                      ) : (
                        <ListChecks className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{dep.name}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{dep.type}</p>
                    </div>
                    <span
                      className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full border"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {dep.nodeType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!sharedDeps && !loadingShared && (
        <EmptyState
          title="Compare two workflows"
          description="Select two workflows above to discover their shared dependencies."
          icon={<Link2 className="w-10 h-10" style={{ color: "var(--color-text-tertiary)" }} />}
        />
      )}
    </div>
  );
}
