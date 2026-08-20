import { getDriver } from "../config/database";

export async function getAllWorkflows() {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (w:Workflow)
      OPTIONAL MATCH (w)-[:CONTAINS]->(t:Task)
      OPTIONAL MATCH (w)-[:OWNED_BY]->(d:Department)
      RETURN w, count(DISTINCT t) AS taskCount, d.name AS department
      ORDER BY w.name
    `);

    return result.records.map((record) => ({
      ...record.get("w").properties,
      taskCount: record.get("taskCount").toNumber(),
      department: record.get("department") || null,
    }));
  } finally {
    await session.close();
  }
}

export async function getWorkflowByName(name: string) {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (w:Workflow {name: $name})
      OPTIONAL MATCH (w)-[:CONTAINS]->(t:Task)
      OPTIONAL MATCH (t)-[:DEPENDS_ON]->(s:System)
      OPTIONAL MATCH (a:Agent)-[:ASSIGNED_TO]->(w)
      OPTIONAL MATCH (w)-[:OWNED_BY]->(d:Department)
      RETURN w,
        collect(DISTINCT {name: t.name, type: t.type, avgDurationMinutes: t.avgDurationMinutes}) AS tasks,
        collect(DISTINCT {name: s.name, type: s.type, vendor: s.vendor}) AS systems,
        collect(DISTINCT {name: a.name, role: a.role, status: a.status}) AS agents,
        d.name AS department
      `,
      { name }
    );

    if (result.records.length === 0) return null;

    const record = result.records[0];
    return {
      ...record.get("w").properties,
      tasks: record.get("tasks").filter((t: any) => t.name),
      systems: record.get("systems").filter((s: any) => s.name),
      agents: record.get("agents").filter((a: any) => a.name),
      department: record.get("department") || null,
    };
  } finally {
    await session.close();
  }
}
