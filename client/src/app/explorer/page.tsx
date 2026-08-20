"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@/hooks/useQuery";
import { fetchGraphData, fetchAgentByName, fetchWorkflowByName, fetchSystemByName } from "@/lib/api";
import { GraphSkeleton } from "@/components/ui/Skeleton";
import { ErrorPopup } from "@/components/ui/ErrorPopup";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/hooks/useTheme";
import { MousePointer2, X } from "lucide-react";

import { GraphFilters } from "@/components/explorer/GraphFilters";
import { NodeDetailSidePanel } from "@/components/explorer/NodeDetailSidePanel";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <GraphSkeleton />,
});

const NODE_COLORS: Record<string, { light: string; dark: string }> = {
  Agent: { light: "#7C1D2E", dark: "#D4567E" },
  Workflow: { light: "#4A6FA5", dark: "#60A5FA" },
  Task: { light: "#2D7A4F", dark: "#4ADE80" },
  System: { light: "#B8860B", dark: "#F59E0B" },
  DataPipeline: { light: "#C4416A", dark: "#E88AA0" },
  Department: { light: "#6B6560", dark: "#A09890" },
};

const LABEL_FILTERS = ["Agent", "Workflow", "Task", "System", "DataPipeline", "Department"];

export default function ExplorerPage() {
  const { data: graphData, loading, error, refetch } = useQuery(fetchGraphData);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(LABEL_FILTERS));
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodeDetail, setNodeDetail] = useState<Record<string, unknown> | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);
  const { addToast } = useToast();
  const { theme } = useTheme();
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const dismissed = sessionStorage.getItem("graphHintDismissed");
    if (dismissed === "true") setShowHint(false);
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    sessionStorage.setItem("graphHintDismissed", "true");
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFilter = useCallback((label: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const handleNodeClick = useCallback(
    async (node: any) => {
      setSelectedNode({ name: node.name, label: node.label, properties: node.properties || {} });
      setLoadingDetail(true);
      setNodeDetail(null);
      try {
        let detail;
        switch (node.label) {
          case "Agent": detail = await fetchAgentByName(node.name); break;
          case "Workflow": detail = await fetchWorkflowByName(node.name); break;
          case "System": detail = await fetchSystemByName(node.name); break;
          default: detail = node.properties;
        }
        setNodeDetail(detail);
      } catch {
        addToast("Failed to load node details", "error");
        setNodeDetail(node.properties);
      } finally {
        setLoadingDetail(false);
      }
    },
    [addToast]
  );

  const filteredData = graphData
    ? {
        nodes: graphData.nodes.filter((n) => activeFilters.has(n.label)),
        links: graphData.edges
          .filter((e) => {
            const s = graphData.nodes.find((n) => n.id === e.source);
            const t = graphData.nodes.find((n) => n.id === e.target);
            return s && t && activeFilters.has(s.label) && activeFilters.has(t.label);
          })
          .map((e) => ({ source: e.source, target: e.target, type: e.type })),
      }
    : { nodes: [], links: [] };

  const isDark = theme === "dark";
  const getNodeColor = useCallback(
    (label: string) => {
      const c = NODE_COLORS[label];
      return c ? (isDark ? c.dark : c.light) : "#666";
    },
    [isDark]
  );

  const paintNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D) => {
      const isHovered = hoveredNodeId === node.id;
      const size = isHovered ? 8 : 6;
      const color = getNodeColor(node.label);

      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 6, 0, 2 * Math.PI);
        ctx.fillStyle = color + "18";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 3, 0, 2 * Math.PI);
        ctx.fillStyle = color + "30";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = color + "40";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = `${isHovered ? "4.5px" : "3.5px"} sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)";
      const label = node.name.length > 20 ? node.name.substring(0, 18) + "…" : node.name;
      ctx.fillText(label, node.x, node.y + size + 2);
    },
    [getNodeColor, isDark, hoveredNodeId]
  );

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Header & Filters */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-3">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
          Graph Explorer
        </h1>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-tertiary)" }}>
          Interactive visualization of your automation graph
        </p>

        <GraphFilters
          labelFilters={LABEL_FILTERS}
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
          isDark={isDark}
        />
      </div>

      {error && <ErrorPopup message={error.message} onRetry={refetch} onClose={() => {}} />}

      {/* Instruction hint */}
      {showHint && !loading && filteredData.nodes.length > 0 && (
        <div
          className="mx-4 sm:mx-6 lg:mx-8 mb-3 px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 animate-slide-up"
          style={{
            backgroundColor: "var(--color-primary-light)",
            border: "1px solid var(--color-primary)",
          }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-primary)" }}>
            <MousePointer2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">Click any node</span>
            <span style={{ color: "var(--color-text-secondary)" }}>
              to inspect its details and connections
            </span>
          </div>
          <button
            onClick={dismissHint}
            className="p-1 rounded-lg transition-colors hover:bg-[var(--color-primary-lighter)] cursor-pointer"
            style={{ color: "var(--color-primary)" }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Graph Area */}
      <div
        className="flex-1 relative mx-4 sm:mx-6 lg:mx-8 mb-6 rounded-2xl overflow-hidden border"
        style={{
          backgroundColor: isDark ? "#0A0A0A" : "#F8F5F0",
          borderColor: "var(--color-border)",
          cursor: "pointer",
        }}
        ref={containerRef}
      >
        {loading ? (
          <GraphSkeleton />
        ) : filteredData.nodes.length === 0 ? (
          <EmptyState title="No nodes to display" description="Try adjusting the filters." />
        ) : (
          <ForceGraph2D
            ref={graphRef}
            graphData={filteredData}
            width={dimensions.width}
            height={dimensions.height}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
              ctx.beginPath();
              ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
            }}
            onNodeClick={handleNodeClick}
            onNodeHover={(node: any) => setHoveredNodeId(node?.id ?? null)}
            linkColor={() => (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)")}
            linkWidth={1}
            linkDirectionalArrowLength={3}
            linkDirectionalArrowRelPos={1}
            backgroundColor="transparent"
            cooldownTicks={100}
            onEngineStop={() => graphRef.current?.zoomToFit(400, 60)}
          />
        )}

        {/* Selected Node Details Drawer */}
        <NodeDetailSidePanel
          selectedNode={selectedNode}
          nodeDetail={nodeDetail}
          loadingDetail={loadingDetail}
          onClose={() => setSelectedNode(null)}
          getNodeColor={getNodeColor}
        />
      </div>
    </div>
  );
}
