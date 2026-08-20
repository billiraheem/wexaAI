"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@/hooks/useQuery";
import {
  fetchSystems,
  fetchWorkflows,
  fetchImpactAnalysis,
  fetchSharedDependencies,
  fetchShortestPath,
  fetchGraphData,
} from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { ShieldAlert, Link2, Route } from "lucide-react";

import { ImpactTab } from "@/components/impact/ImpactTab";
import { SharedDepsTab } from "@/components/impact/SharedDepsTab";
import { ShortestPathTab } from "@/components/impact/ShortestPathTab";
import { ComboboxOption } from "@/components/ui/Combobox";

export default function ImpactPage() {
  const { data: systems, loading: loadingSystems } = useQuery(fetchSystems);
  const { data: workflows, loading: loadingWorkflows } = useQuery(fetchWorkflows);
  const { data: graphData } = useQuery(fetchGraphData);
  const { addToast } = useToast();

  const [selectedSystem, setSelectedSystem] = useState("");
  const [impactResult, setImpactResult] = useState<any>(null);
  const [loadingImpact, setLoadingImpact] = useState(false);
  const [impactError, setImpactError] = useState<string | null>(null);

  const [workflow1, setWorkflow1] = useState("");
  const [workflow2, setWorkflow2] = useState("");
  const [sharedDeps, setSharedDeps] = useState<any[] | null>(null);
  const [loadingShared, setLoadingShared] = useState(false);

  const [pathFrom, setPathFrom] = useState("");
  const [pathTo, setPathTo] = useState("");
  const [pathResult, setPathResult] = useState<any>(null);
  const [loadingPath, setLoadingPath] = useState(false);

  const [activeTab, setActiveTab] = useState<"impact" | "shared" | "path">("impact");

  const allNodes: ComboboxOption[] = useMemo(() => {
    if (!graphData?.nodes) return [];
    return graphData.nodes.map((n) => ({
      value: n.name,
      label: n.name,
      group: n.label,
    }));
  }, [graphData]);

  const runImpactAnalysis = useCallback(async () => {
    if (!selectedSystem) return;
    setLoadingImpact(true);
    setImpactError(null);
    try {
      const result = await fetchImpactAnalysis(selectedSystem);
      setImpactResult(result);
      addToast(`Impact analysis complete for ${selectedSystem}`, "success");
    } catch (err: any) {
      setImpactError(err.message);
      addToast("Impact analysis failed", "error");
    } finally {
      setLoadingImpact(false);
    }
  }, [selectedSystem, addToast]);

  const findSharedDeps = useCallback(async () => {
    if (!workflow1 || !workflow2) return;
    setLoadingShared(true);
    try {
      const result = await fetchSharedDependencies(workflow1, workflow2);
      setSharedDeps(result);
      addToast(
        result.length > 0
          ? `Found ${result.length} shared dependencies`
          : "No shared dependencies found",
        result.length > 0 ? "success" : "info"
      );
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setLoadingShared(false);
    }
  }, [workflow1, workflow2, addToast]);

  const findShortestPath = useCallback(async () => {
    if (!pathFrom || !pathTo) return;
    setLoadingPath(true);
    try {
      const result = await fetchShortestPath(pathFrom, pathTo);
      setPathResult(result);
      addToast(`Path found: ${result.length} hop${result.length !== 1 ? "s" : ""}`, "success");
    } catch (err: any) {
      setPathResult(null);
      addToast(err.message, "error");
    } finally {
      setLoadingPath(false);
    }
  }, [pathFrom, pathTo, addToast]);

  const tabs = [
    { id: "impact" as const, label: "Impact Analysis", icon: ShieldAlert },
    { id: "shared" as const, label: "Shared Dependencies", icon: Link2 },
    { id: "path" as const, label: "Shortest Path", icon: Route },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          Analysis Tools
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Run impact analysis, find shared dependencies, and discover paths
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b pb-4 overflow-x-auto" style={{ borderColor: "var(--color-border)" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer"
              style={{
                backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                color: isActive ? "var(--color-primary)" : "var(--color-text-tertiary)",
                border: isActive ? "1px solid var(--color-primary)" : "1px solid transparent",
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "impact" && (
        <ImpactTab
          systems={systems || undefined}
          loadingSystems={loadingSystems}
          selectedSystem={selectedSystem}
          onSystemChange={setSelectedSystem}
          onAnalyze={runImpactAnalysis}
          loadingImpact={loadingImpact}
          impactResult={impactResult}
          impactError={impactError}
          onClearError={() => setImpactError(null)}
        />
      )}

      {activeTab === "shared" && (
        <SharedDepsTab
          workflows={workflows || undefined}
          loadingWorkflows={loadingWorkflows}
          workflow1={workflow1}
          workflow2={workflow2}
          onWorkflow1Change={setWorkflow1}
          onWorkflow2Change={setWorkflow2}
          onFindShared={findSharedDeps}
          loadingShared={loadingShared}
          sharedDeps={sharedDeps}
        />
      )}

      {activeTab === "path" && (
        <ShortestPathTab
          pathFrom={pathFrom}
          pathTo={pathTo}
          onPathFromChange={setPathFrom}
          onPathToChange={setPathTo}
          onFindPath={findShortestPath}
          loadingPath={loadingPath}
          pathResult={pathResult}
          allNodes={allNodes}
        />
      )}
    </div>
  );
}
