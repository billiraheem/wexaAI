import { getDriver } from "../config/database";

export async function getAllSystems() {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (s:System)
      OPTIONAL MATCH (t:Task)-[:DEPENDS_ON]->(s)
      RETURN s, count(DISTINCT t) AS dependentTaskCount
      ORDER BY s.name
    `);

    return result.records.map((record) => ({
      ...record.get("s").properties,
      dependentTaskCount: record.get("dependentTaskCount").toNumber(),
    }));
  } finally {
    await session.close();
  }
}

export async function getSystemByName(name: string) {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (s:System {name: $name})
      OPTIONAL MATCH (t:Task)-[:DEPENDS_ON]->(s)
      OPTIONAL MATCH (t)<-[:CONTAINS]-(w:Workflow)
      OPTIONAL MATCH (s)-[:FEEDS]->(pOut:DataPipeline)
      OPTIONAL MATCH (pIn:DataPipeline)-[:FEEDS]->(s)
      RETURN s,
        collect(DISTINCT {name: t.name, type: t.type}) AS dependentTasks,
        collect(DISTINCT {name: w.name, category: w.category}) AS workflows,
        collect(DISTINCT {name: pOut.name, direction: pOut.direction}) AS outboundPipelines,
        collect(DISTINCT {name: pIn.name, direction: pIn.direction}) AS inboundPipelines
      `,
      { name }
    );

    if (result.records.length === 0) return null;

    const record = result.records[0];
    return {
      ...record.get("s").properties,
      dependentTasks: record.get("dependentTasks").filter((t: any) => t.name),
      workflows: record.get("workflows").filter((w: any) => w.name),
      outboundPipelines: record.get("outboundPipelines").filter((p: any) => p.name),
      inboundPipelines: record.get("inboundPipelines").filter((p: any) => p.name),
    };
  } finally {
    await session.close();
  }
}
