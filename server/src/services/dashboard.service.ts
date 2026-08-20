import { getDriver } from "../config/database";
import { DashboardStats } from "../types";

export async function getStats(): Promise<DashboardStats> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (a:Agent) WITH count(a) AS agentCount
      MATCH (w:Workflow) WITH agentCount, count(w) AS workflowCount
      MATCH (t:Task) WITH agentCount, workflowCount, count(t) AS taskCount
      MATCH (s:System) WITH agentCount, workflowCount, taskCount, count(s) AS systemCount
      MATCH (p:DataPipeline) WITH agentCount, workflowCount, taskCount, systemCount, count(p) AS pipelineCount
      MATCH (d:Department) 
      RETURN agentCount, workflowCount, taskCount, systemCount, pipelineCount, count(d) AS departmentCount
    `);

    const record = result.records[0];
    return {
      agentCount: record.get("agentCount").toNumber(),
      workflowCount: record.get("workflowCount").toNumber(),
      taskCount: record.get("taskCount").toNumber(),
      systemCount: record.get("systemCount").toNumber(),
      pipelineCount: record.get("pipelineCount").toNumber(),
      departmentCount: record.get("departmentCount").toNumber(),
    };
  } finally {
    await session.close();
  }
}

export async function getHighlights() {
  const driver = getDriver();
  const s1 = driver.session();
  const s2 = driver.session();
  const s3 = driver.session();

  try {
    const [impactResult, agentResult, workflowResult] = await Promise.all([
      s1.run(`
        MATCH (s:System)<-[:DEPENDS_ON]-(t:Task)
        WITH s, count(t) AS depCount
        ORDER BY depCount DESC LIMIT 1
        OPTIONAL MATCH (t2:Task)-[:DEPENDS_ON]->(s)
        OPTIONAL MATCH (t2)<-[:CONTAINS]-(w:Workflow)
        RETURN s.name AS name, s.type AS type, s.vendor AS vendor,
          depCount, count(DISTINCT w) AS workflowCount
      `),
      s2.run(`
        MATCH (a:Agent)
        OPTIONAL MATCH (a)-[:EXECUTES]->(t:Task)
        OPTIONAL MATCH (a)-[:ASSIGNED_TO]->(w:Workflow)
        RETURN a.name AS name, a.role AS role, a.status AS status,
          count(DISTINCT t) AS taskCount, count(DISTINCT w) AS workflowCount
        ORDER BY count(DISTINCT t) DESC LIMIT 8
      `),
      s3.run(`
        MATCH (w:Workflow)
        OPTIONAL MATCH (w)-[:CONTAINS]->(t:Task)
        OPTIONAL MATCH (a:Agent)-[:ASSIGNED_TO]->(w)
        OPTIONAL MATCH (w)-[:OWNED_BY]->(d:Department)
        RETURN w.name AS name, w.category AS category, d.name AS department,
          count(DISTINCT t) AS taskCount, count(DISTINCT a) AS agentCount
        ORDER BY count(DISTINCT t) DESC LIMIT 6
      `),
    ]);

    const impactRecord = impactResult.records[0];
    const topSystem = impactRecord
      ? {
          name: impactRecord.get("name"),
          type: impactRecord.get("type"),
          vendor: impactRecord.get("vendor"),
          dependentTasks: impactRecord.get("depCount").toNumber(),
          affectedWorkflows: impactRecord.get("workflowCount").toNumber(),
        }
      : null;

    const topAgents = agentResult.records.map((r) => ({
      name: r.get("name"),
      role: r.get("role"),
      status: r.get("status"),
      taskCount: r.get("taskCount").toNumber(),
      workflowCount: r.get("workflowCount").toNumber(),
    }));

    const topWorkflows = workflowResult.records.map((r) => ({
      name: r.get("name"),
      category: r.get("category"),
      department: r.get("department") || "Unassigned",
      taskCount: r.get("taskCount").toNumber(),
      agentCount: r.get("agentCount").toNumber(),
    }));

    return { topSystem, topAgents, topWorkflows };
  } finally {
    await Promise.all([s1.close(), s2.close(), s3.close()]);
  }
}

