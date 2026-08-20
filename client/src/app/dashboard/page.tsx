"use client";

import { useQuery } from "@/hooks/useQuery";
import { fetchDashboardStats, fetchDashboardHighlights } from "@/lib/api";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ErrorPopup } from "@/components/ui/ErrorPopup";
import { Bot, GitBranch, Server, ListChecks, ArrowRightLeft, Building2 } from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { DepartmentBarChart } from "@/components/dashboard/DepartmentBarChart";
import { SpotlightCard } from "@/components/dashboard/SpotlightCard";
import { TopWorkflowsGrid } from "@/components/dashboard/TopWorkflowsGrid";

export default function DashboardPage() {
  const { data: stats, loading: loadingStats, error: statsError, refetch: refetchStats } = useQuery(fetchDashboardStats);
  const { data: highlights, loading: loadingHighlights, error: highlightsError, refetch: refetchHighlights } = useQuery(fetchDashboardHighlights);

  const statCards = [
    {
      label: "Active Agents",
      sublabel: "AI virtual coworkers",
      value: stats?.agentCount ?? 0,
      max: 25,
      icon: Bot,
      color: "var(--color-primary)",
    },
    {
      label: "Workflows",
      sublabel: "Automated processes",
      value: stats?.workflowCount ?? 0,
      max: 25,
      icon: GitBranch,
      color: "var(--color-accent)",
    },
    {
      label: "Systems",
      sublabel: "Integrated platforms",
      value: stats?.systemCount ?? 0,
      max: 25,
      icon: Server,
      color: "#B8860B",
    },
    {
      label: "Tasks",
      sublabel: "Automated operations",
      value: stats?.taskCount ?? 0,
      max: 60,
      icon: ListChecks,
      color: "#2D7A4F",
    },
    {
      label: "Pipelines",
      sublabel: "Data connections",
      value: stats?.pipelineCount ?? 0,
      max: 15,
      icon: ArrowRightLeft,
      color: "#C4416A",
    },
    {
      label: "Departments",
      sublabel: "Business units",
      value: stats?.departmentCount ?? 0,
      max: 10,
      icon: Building2,
      color: "#4A6FA5",
    },
  ];

  const categoryChartData = highlights?.topWorkflows
    ? (() => {
        const cats: Record<string, number> = {};
        highlights.topWorkflows.forEach((w) => {
          cats[w.category] = (cats[w.category] || 0) + w.taskCount;
        });
        const colors = ["#7C1D2E", "#C4416A", "#D4567E", "#B8860B", "#4A6FA5", "#2D7A4F"];
        return Object.entries(cats).map(([label, value], i) => ({
          label,
          value,
          color: colors[i % colors.length],
        }));
      })()
    : [];

  const deptChartData = highlights?.topWorkflows
    ? (() => {
        const depts: Record<string, number> = {};
        highlights.topWorkflows.forEach((w) => {
          depts[w.department] = (depts[w.department] || 0) + 1;
        });
        const colors = ["#9B2842", "#C4416A", "#D4567E", "#B8860B", "#4A6FA5", "#2D7A4F"];
        return Object.entries(depts).map(([label, value], i) => ({
          label,
          value,
          color: colors[i % colors.length],
        }));
      })()
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Overview of your enterprise automation landscape
        </p>
      </div>

      {statsError && (
        <ErrorPopup message={statsError.message} onRetry={refetchStats} onClose={() => {}} />
      )}
      {highlightsError && !statsError && (
        <ErrorPopup message={highlightsError.message} onRetry={refetchHighlights} onClose={() => {}} />
      )}

      {/* Row 1 — Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {loadingStats
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Row 2 — Charts + Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Recharts Pie Chart: Tasks by Category */}
        {loadingHighlights ? (
          <CardSkeleton />
        ) : (
          <CategoryPieChart
            data={categoryChartData}
            title="Tasks by Category"
            subtitle="Distribution across workflow types"
          />
        )}

        {/* Recharts Bar Chart: Workflows by Department */}
        {loadingHighlights ? (
          <CardSkeleton />
        ) : (
          <DepartmentBarChart
            data={deptChartData}
            title="Workflows by Department"
            subtitle="Business unit distribution"
          />
        )}

        {/* Spotlight: Highest-Impact System */}
        <SpotlightCard topSystem={highlights?.topSystem || null} loading={loadingHighlights} />
      </div>

      {/* Row 3 — Top Workflows */}
      <TopWorkflowsGrid workflows={highlights?.topWorkflows} loading={loadingHighlights} />
    </div>
  );
}
