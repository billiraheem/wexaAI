import { getDriver } from "../config/database";
import { ImpactResult, AgentLoad, SharedDependency } from "../types";

export async function getImpactAnalysis(systemName: string): Promise<ImpactResult> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (s:System {name: $name})
      OPTIONAL MATCH (t:Task)-[:DEPENDS_ON]->(s)
      OPTIONAL MATCH (t)<-[:CONTAINS]-(w:Workflow)
      OPTIONAL MATCH (a:Agent)-[:ASSIGNED_TO]->(w)
      OPTIONAL MATCH (s)-[:FEEDS]->(p:DataPipeline)-[:FEEDS]->(ds:System)
      OPTIONAL MATCH (dt:Task)-[:DEPENDS_ON]->(ds)
      OPTIONAL MATCH (dt)<-[:CONTAINS]-(dw:Workflow)
      OPTIONAL MATCH (da:Agent)-[:ASSIGNED_TO]->(dw)
      WITH s,
        collect(DISTINCT {name: t.name, type: t.type}) AS directTasks,
        collect(DISTINCT {name: w.name, category: w.category}) AS directWorkflows,
        collect(DISTINCT {name: a.name, role: a.role}) AS directAgents,
        collect(DISTINCT {name: p.name}) AS pipelines,
        collect(DISTINCT {name: ds.name, type: ds.type}) AS downstreamSystems,
        collect(DISTINCT {name: dt.name, type: dt.type}) AS downstreamTasks,
        collect(DISTINCT {name: dw.name, category: dw.category}) AS downstreamWorkflows,
        collect(DISTINCT {name: da.name, role: da.role}) AS downstreamAgents
      RETURN s.name AS system,
        directTasks + downstreamTasks AS affectedTasks,
        directWorkflows + downstreamWorkflows AS affectedWorkflows,
        directAgents + downstreamAgents AS affectedAgents,
        pipelines AS affectedPipelines,
        downstreamSystems
      `,
      { name: systemName }
    );

    if (result.records.length === 0) {
      return {
        system: systemName,
        affectedWorkflows: [],
        affectedAgents: [],
        affectedTasks: [],
        affectedPipelines: [],
        downstreamSystems: [],
      };
    }

    const record = result.records[0];

    const dedup = (arr: any[]) => {
      const seen = new Set();
      return arr.filter((item) => {
        if (!item.name || seen.has(item.name)) return false;
        seen.add(item.name);
        return true;
      });
    };

    return {
      system: record.get("system"),
      affectedWorkflows: dedup(record.get("affectedWorkflows")),
      affectedAgents: dedup(record.get("affectedAgents")),
      affectedTasks: dedup(record.get("affectedTasks")),
      affectedPipelines: dedup(record.get("affectedPipelines")),
      downstreamSystems: dedup(record.get("downstreamSystems")),
    };
  } finally {
    await session.close();
  }
}

export async function getSharedDependencies(
  workflow1: string,
  workflow2: string
): Promise<SharedDependency[]> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (w1:Workflow {name: $w1})-[:CONTAINS]->(:Task)-[:DEPENDS_ON]->(s:System)<-[:DEPENDS_ON]-(:Task)<-[:CONTAINS]-(w2:Workflow {name: $w2})
      RETURN DISTINCT s.name AS name, s.type AS type, 'System' AS nodeType
      UNION
      MATCH (w1:Workflow {name: $w1})-[:CONTAINS]->(t:Task)<-[:CONTAINS]-(w2:Workflow {name: $w2})
      RETURN DISTINCT t.name AS name, t.type AS type, 'Task' AS nodeType
      `,
      { w1: workflow1, w2: workflow2 }
    );

    return result.records.map((record) => ({
      name: record.get("name"),
      type: record.get("type"),
      nodeType: record.get("nodeType"),
    }));
  } finally {
    await session.close();
  }
}

export async function getAgentLoadRanking(): Promise<AgentLoad[]> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (a:Agent)
      OPTIONAL MATCH (a)-[:EXECUTES]->(t:Task)
      OPTIONAL MATCH (a)-[:ASSIGNED_TO]->(w:Workflow)
      RETURN a.name AS name, a.role AS role, a.status AS status,
        count(DISTINCT t) AS taskCount, count(DISTINCT w) AS workflowCount
      ORDER BY taskCount DESC, workflowCount DESC
    `);

    return result.records.map((record) => ({
      name: record.get("name"),
      role: record.get("role"),
      status: record.get("status"),
      taskCount: record.get("taskCount").toNumber(),
      workflowCount: record.get("workflowCount").toNumber(),
    }));
  } finally {
    await session.close();
  }
}

export async function getShortestPath(fromName: string, toName: string) {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (start {name: $from}), (end {name: $to})
      MATCH p = shortestPath((start)-[*]-(end))
      RETURN p
      `,
      { from: fromName, to: toName }
    );

    if (result.records.length === 0) return null;

    const path = result.records[0].get("p");
    const nodes = path.segments.map((seg: any, i: number) => {
      const items = [];
      if (i === 0) {
        items.push({
          id: seg.start.elementId,
          label: seg.start.labels[0],
          name: seg.start.properties.name,
          properties: seg.start.properties,
        });
      }
      items.push({
        id: seg.end.elementId,
        label: seg.end.labels[0],
        name: seg.end.properties.name,
        properties: seg.end.properties,
      });
      return items;
    }).flat();

    const pathSegments = path.segments.map((seg: any) => ({
      startNode: {
        id: seg.start.elementId,
        label: seg.start.labels[0],
        name: seg.start.properties.name,
        properties: seg.start.properties,
      },
      endNode: {
        id: seg.end.elementId,
        label: seg.end.labels[0],
        name: seg.end.properties.name,
        properties: seg.end.properties,
      },
      relationship: seg.relationship.type,
    }));

    return {
      path: pathSegments,
      nodes,
      length: path.segments.length,
    };
  } finally {
    await session.close();
  }
}

export async function getFullGraph() {
  const driver = getDriver();
  const session = driver.session();

  try {
    const nodesResult = await session.run(`
      MATCH (n)
      WHERE n:Agent OR n:Workflow OR n:Task OR n:System OR n:DataPipeline OR n:Department
      RETURN n, labels(n)[0] AS label
    `);

    const edgesResult = await session.run(`
      MATCH (a)-[r]->(b)
      WHERE (a:Agent OR a:Workflow OR a:Task OR a:System OR a:DataPipeline OR a:Department)
        AND (b:Agent OR b:Workflow OR b:Task OR b:System OR b:DataPipeline OR b:Department)
      RETURN a.name AS source, b.name AS target, type(r) AS relType
    `);

    const nodes = nodesResult.records.map((record) => {
      const node = record.get("n");
      return {
        id: node.properties.name,
        label: record.get("label"),
        name: node.properties.name,
        properties: node.properties,
      };
    });

    const edges = edgesResult.records.map((record) => ({
      source: record.get("source"),
      target: record.get("target"),
      type: record.get("relType"),
    }));

    return { nodes, edges };
  } finally {
    await session.close();
  }
}
