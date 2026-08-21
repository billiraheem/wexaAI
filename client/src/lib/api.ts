const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface FetchOptions {
  signal?: AbortSignal;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    signal: options.signal,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "An unexpected error occurred" }));
    throw new ApiError(error.message || `Request failed with status ${res.status}`, res.status, error.code);
  }

  return res.json();
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code || "UNKNOWN";
  }
}

export async function fetchDashboardStats() {
  return apiFetch<{
    agentCount: number;
    workflowCount: number;
    taskCount: number;
    systemCount: number;
    pipelineCount: number;
    departmentCount: number;
  }>("/dashboard/stats");
}

export async function fetchDashboardHighlights() {
  return apiFetch<{
    topSystem: {
      name: string;
      type: string;
      vendor: string;
      dependentTasks: number;
      affectedWorkflows: number;
    } | null;
    topAgents: Array<{
      name: string;
      role: string;
      status: string;
      taskCount: number;
      workflowCount: number;
    }>;
    topWorkflows: Array<{
      name: string;
      category: string;
      department: string;
      taskCount: number;
      agentCount: number;
    }>;
  }>("/dashboard/highlights");
}

export async function fetchAgents() {
  return apiFetch<Array<{
    name: string;
    role: string;
    status: string;
    workflowCount: number;
    taskCount: number;
  }>>("/agents");
}

export async function fetchAgentByName(name: string) {
  return apiFetch<{
    name: string;
    role: string;
    status: string;
    workflows: Array<{ name: string; category: string }>;
    tasks: Array<{ name: string; type: string; avgDurationMinutes: number }>;
    systems: Array<{ name: string; type: string }>;
  }>(`/agents/${encodeURIComponent(name)}`);
}

export async function fetchWorkflows() {
  return apiFetch<Array<{
    name: string;
    description: string;
    category: string;
    taskCount: number;
    department: string | null;
  }>>("/workflows");
}

export async function fetchWorkflowByName(name: string) {
  return apiFetch<{
    name: string;
    description: string;
    category: string;
    tasks: Array<{ name: string; type: string; avgDurationMinutes: number }>;
    systems: Array<{ name: string; type: string; vendor: string }>;
    agents: Array<{ name: string; role: string; status: string }>;
    department: string | null;
  }>(`/workflows/${encodeURIComponent(name)}`);
}

export async function fetchSystems() {
  return apiFetch<Array<{
    name: string;
    type: string;
    vendor: string;
    dependentTaskCount: number;
  }>>("/systems");
}

export async function fetchSystemByName(name: string) {
  return apiFetch<{
    name: string;
    type: string;
    vendor: string;
    dependentTasks: Array<{ name: string; type: string }>;
    workflows: Array<{ name: string; category: string }>;
    outboundPipelines: Array<{ name: string; direction: string }>;
    inboundPipelines: Array<{ name: string; direction: string }>;
  }>(`/systems/${encodeURIComponent(name)}`);
}

export async function fetchImpactAnalysis(systemName: string) {
  return apiFetch<{
    system: string;
    affectedWorkflows: Array<{ name: string; category: string }>;
    affectedAgents: Array<{ name: string; role: string }>;
    affectedTasks: Array<{ name: string; type: string }>;
    affectedPipelines: Array<{ name: string }>;
    downstreamSystems: Array<{ name: string; type: string }>;
  }>(`/analysis/impact?system=${encodeURIComponent(systemName)}`);
}

export async function fetchSharedDependencies(w1: string, w2: string) {
  return apiFetch<Array<{
    name: string;
    type: string;
    nodeType: string;
  }>>(`/analysis/shared-deps?w1=${encodeURIComponent(w1)}&w2=${encodeURIComponent(w2)}`);
}

export async function fetchAgentLoad(page: number = 1, limit: number = 10, sortBy: string = "tasks") {
  return apiFetch<{
    data: Array<{
      name: string;
      role: string;
      status: string;
      taskCount: number;
      workflowCount: number;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(`/analysis/agent-load?page=${page}&limit=${limit}&sortBy=${encodeURIComponent(sortBy)}`);
}

export async function fetchShortestPath(from: string, to: string) {
  return apiFetch<{
    path: Array<{
      startNode: { id: string; label: string; name: string; properties: Record<string, unknown> };
      endNode: { id: string; label: string; name: string; properties: Record<string, unknown> };
      relationship: string;
    }>;
    nodes: Array<{ id: string; label: string; name: string; properties: Record<string, unknown> }>;
    length: number;
  }>(`/analysis/shortest-path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}

export async function fetchGraphData() {
  return apiFetch<{
    nodes: Array<{ id: string; label: string; name: string; properties: Record<string, unknown> }>;
    edges: Array<{ source: string; target: string; type: string }>;
  }>("/analysis/graph");
}
