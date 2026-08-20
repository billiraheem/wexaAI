import { getDriver } from "../config/database";

export async function getAllAgents() {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (a:Agent)
      OPTIONAL MATCH (a)-[:ASSIGNED_TO]->(w:Workflow)
      OPTIONAL MATCH (a)-[:EXECUTES]->(t:Task)
      RETURN a, count(DISTINCT w) AS workflowCount, count(DISTINCT t) AS taskCount
      ORDER BY a.name
    `);

    return result.records.map((record) => ({
      ...record.get("a").properties,
      workflowCount: record.get("workflowCount").toNumber(),
      taskCount: record.get("taskCount").toNumber(),
    }));
  } finally {
    await session.close();
  }
}

export async function getAgentByName(name: string) {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (a:Agent {name: $name})
      OPTIONAL MATCH (a)-[:ASSIGNED_TO]->(w:Workflow)
      OPTIONAL MATCH (a)-[:EXECUTES]->(t:Task)
      OPTIONAL MATCH (t)-[:DEPENDS_ON]->(s:System)
      RETURN a,
        collect(DISTINCT {name: w.name, category: w.category}) AS workflows,
        collect(DISTINCT {name: t.name, type: t.type, avgDurationMinutes: t.avgDurationMinutes}) AS tasks,
        collect(DISTINCT {name: s.name, type: s.type}) AS systems
      `,
      { name }
    );

    if (result.records.length === 0) return null;

    const record = result.records[0];
    return {
      ...record.get("a").properties,
      workflows: record.get("workflows").filter((w: any) => w.name),
      tasks: record.get("tasks").filter((t: any) => t.name),
      systems: record.get("systems").filter((s: any) => s.name),
    };
  } finally {
    await session.close();
  }
}
