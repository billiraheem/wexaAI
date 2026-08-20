"use client";

import { Search, ShieldAlert, AlertTriangle, Loader2, GitBranch, Bot, ListChecks, Server, ArrowRightLeft } from "lucide-react";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ErrorPopup } from "@/components/ui/ErrorPopup";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectDropdown } from "@/components/ui/SelectDropdown";

interface ImpactTabProps {
  systems: Array<{ name: string; type: string }> | undefined;
  loadingSystems: boolean;
  selectedSystem: string;
  onSystemChange: (system: string) => void;
  onAnalyze: () => void;
  loadingImpact: boolean;
  impactResult: any;
  impactError: string | null;
  onClearError: () => void;
}

export function ImpactTab({
  systems,
  loadingSystems,
  selectedSystem,
  onSystemChange,
  onAnalyze,
  loadingImpact,
  impactResult,
  impactError,
  onClearError,
}: ImpactTabProps) {
  const totalAffected = impactResult
    ? impactResult.affectedWorkflows.length +
      impactResult.affectedAgents.length +
      impactResult.affectedTasks.length
    : 0;

  const systemOptions = loadingSystems
    ? [{ value: "", label: "Loading systems..." }]
    : (systems || []).map((s) => ({
        value: s.name,
        label: s.name,
        sublabel: s.type,
      }));

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
          <ShieldAlert className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          System Impact Analysis
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Select a system to see what workflows, agents, and tasks would be affected if it goes down.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SelectDropdown
              options={systemOptions}
              value={selectedSystem}
              onChange={onSystemChange}
              placeholder="Select a system..."
              disabled={loadingSystems}
              icon={
                <Search
                  className="w-4 h-4"
                  style={{ color: "var(--color-text-tertiary)" }}
                />
              }
            />
          </div>
          <button
            onClick={onAnalyze}
            disabled={!selectedSystem || loadingImpact}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-inverse)",
            }}
          >
            {loadingImpact ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            Analyze Impact
          </button>
        </div>
      </div>

      {impactError && (
        <ErrorPopup
          message={impactError}
          onRetry={onAnalyze}
          onClose={onClearError}
        />
      )}

      {loadingImpact && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {impactResult && !loadingImpact && (
        <div>
          <div
            className="rounded-2xl border p-6 mb-6"
            style={{
              backgroundColor: "var(--color-primary-light)",
              borderColor: "var(--color-primary)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
                Impact Summary
              </h3>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text)" }}>
              If <span className="font-semibold" style={{ color: "var(--color-primary)" }}>{impactResult.system}</span> goes down,{" "}
              <span className="font-semibold" style={{ color: "var(--color-text)" }}>{totalAffected}</span> components are directly or indirectly affected:
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
              {impactResult.affectedWorkflows.length} workflows •{" "}
              {impactResult.affectedAgents.length} agents •{" "}
              {impactResult.affectedTasks.length} tasks
              {impactResult.downstreamSystems.length > 0 &&
                ` • ${impactResult.downstreamSystems.length} downstream systems via pipelines`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {impactResult.affectedWorkflows.length > 0 && (
              <div
                className="rounded-2xl border p-5"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                  <h4 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    Affected Workflows ({impactResult.affectedWorkflows.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {impactResult.affectedWorkflows.map((w: any) => (
                    <div
                      key={w.name}
                      className="px-3 py-2 rounded-lg border text-sm flex items-center justify-between"
                      style={{
                        backgroundColor: "var(--color-primary-lighter)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      <span>{w.name}</span>
                      {w.category && (
                        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                          {w.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {impactResult.affectedAgents.length > 0 && (
              <div
                className="rounded-2xl border p-5"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                  <h4 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    Affected Agents ({impactResult.affectedAgents.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {impactResult.affectedAgents.map((a: any) => (
                    <div
                      key={a.name}
                      className="px-3 py-2 rounded-lg border text-sm flex items-center justify-between"
                      style={{
                        backgroundColor: "var(--color-accent-light)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      <span>{a.name}</span>
                      {a.role && (
                        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                          {a.role}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {impactResult.affectedTasks.length > 0 && (
              <div
                className="rounded-2xl border p-5"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                  <h4 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    Affected Tasks ({impactResult.affectedTasks.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {impactResult.affectedTasks.map((t: any) => (
                    <div
                      key={t.name}
                      className="px-3 py-2 rounded-lg border text-sm flex items-center justify-between"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      <span>{t.name}</span>
                      {t.type && (
                        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                          {t.type}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {impactResult.downstreamSystems.length > 0 && (
              <div
                className="rounded-2xl border p-5"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                  <h4 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    Downstream Systems ({impactResult.downstreamSystems.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {impactResult.downstreamSystems.map((s: any) => (
                    <div
                      key={s.name}
                      className="px-3 py-2 rounded-lg border text-sm flex items-center justify-between"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      <span>{s.name}</span>
                      {s.type && (
                        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                          {s.type}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {impactResult.affectedPipelines.length > 0 && (
              <div
                className="rounded-2xl border p-5"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRightLeft className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                  <h4 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    Affected Pipelines ({impactResult.affectedPipelines.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {impactResult.affectedPipelines.map((p: any) => (
                    <div
                      key={p.name}
                      className="px-3 py-2 rounded-lg border text-sm"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!impactResult && !loadingImpact && selectedSystem === "" && (
        <EmptyState
          title="Select a system to analyze"
          description="Choose a system from the dropdown above to see what would break if it goes down."
          icon={<ShieldAlert className="w-10 h-10" style={{ color: "var(--color-text-tertiary)" }} />}
        />
      )}
    </div>
  );
}
