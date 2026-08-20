export interface Agent {
  name: string;
  role: string;
  status: string;
}

export interface Workflow {
  name: string;
  description: string;
  category: string;
}

export interface Task {
  name: string;
  type: string;
  avgDurationMinutes: number;
}

export interface System {
  name: string;
  type: string;
  vendor: string;
}

export interface DataPipeline {
  name: string;
  direction: string;
}

export interface Department {
  name: string;
}

export interface GraphNode {
  id: string;
  label: string;
  name: string;
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ImpactResult {
  system: string;
  affectedWorkflows: { name: string; category: string }[];
  affectedAgents: { name: string; role: string }[];
  affectedTasks: { name: string; type: string }[];
  affectedPipelines: { name: string }[];
  downstreamSystems: { name: string; type: string }[];
}

export interface SharedDependency {
  name: string;
  type: string;
  nodeType: string;
}

export interface AgentLoad {
  name: string;
  role: string;
  status: string;
  taskCount: number;
  workflowCount: number;
}

export interface PathSegment {
  startNode: GraphNode;
  endNode: GraphNode;
  relationship: string;
}

export interface ShortestPathResult {
  path: PathSegment[];
  nodes: GraphNode[];
  length: number;
}

export interface DashboardStats {
  agentCount: number;
  workflowCount: number;
  taskCount: number;
  systemCount: number;
  pipelineCount: number;
  departmentCount: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}
