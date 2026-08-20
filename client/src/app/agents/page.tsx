"use client";

import { useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { fetchAgentLoad, fetchAgentByName } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ErrorPopup } from "@/components/ui/ErrorPopup";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { Users } from "lucide-react";
import { SortControls } from "@/components/agents/SortControls";
import { AgentTable } from "@/components/agents/AgentTable";
import { AgentDetailDrawer } from "@/components/agents/AgentDetailDrawer";

export default function AgentsPage() {
  const { data: agents, loading, error, refetch } = useQuery(fetchAgentLoad);
  const [sortBy, setSortBy] = useState<"tasks" | "workflows">("tasks");
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { addToast } = useToast();

  const sorted = agents
    ? [...agents].sort((a, b) =>
        sortBy === "tasks"
          ? b.taskCount - a.taskCount
          : b.workflowCount - a.workflowCount
      )
    : [];

  const maxTasks = sorted.length > 0 ? sorted[0].taskCount : 1;

  const handleAgentClick = async (agentName: string) => {
    setLoadingDetail(true);
    try {
      const detail = await fetchAgentByName(agentName);
      setSelectedAgent(detail);
    } catch {
      addToast("Failed to load agent details", "error");
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          Agent Load
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Ranked view of AI agents by workload distribution
        </p>
      </div>

      {error && (
        <ErrorPopup
          message={error.message}
          onRetry={refetch}
          onClose={() => {}}
        />
      )}

      {/* Controls */}
      <SortControls sortBy={sortBy} onSortChange={setSortBy} />

      {/* Content Grid */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : sorted.length === 0 ? (
        <EmptyState
          title="No agents found"
          description="No agent data is available. Make sure the database has been seeded."
          icon={<Users className="w-10 h-10" style={{ color: "var(--color-text-tertiary)" }} />}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <AgentTable
              agents={sorted}
              maxTasks={maxTasks}
              selectedAgentName={selectedAgent?.name}
              onAgentClick={handleAgentClick}
            />
          </div>

          {selectedAgent && (
            <AgentDetailDrawer
              agent={selectedAgent}
              loading={loadingDetail}
              onClose={() => setSelectedAgent(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
