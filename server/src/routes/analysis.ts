import { Router, Request, Response, NextFunction } from "express";
import {
  getImpactAnalysis,
  getSharedDependencies,
  getAgentLoadRanking,
  getShortestPath,
  getFullGraph,
} from "../services/analysis.service";

const router = Router();

router.get("/impact", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const system = req.query.system as string;
    if (!system) {
      res.status(400).json({ message: "Query parameter 'system' is required", code: "BAD_REQUEST", status: 400 });
      return;
    }
    const result = await getImpactAnalysis(system);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/shared-deps", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const w1 = req.query.w1 as string;
    const w2 = req.query.w2 as string;
    if (!w1 || !w2) {
      res.status(400).json({ message: "Query parameters 'w1' and 'w2' are required", code: "BAD_REQUEST", status: 400 });
      return;
    }
    const result = await getSharedDependencies(w1, w2);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/agent-load", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const sortBy = (req.query.sortBy as string) === "workflows" ? "workflows" : "tasks";

    const result = await getAgentLoadRanking(page, limit, sortBy);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/shortest-path", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;
    if (!from || !to) {
      res.status(400).json({ message: "Query parameters 'from' and 'to' are required", code: "BAD_REQUEST", status: 400 });
      return;
    }
    const result = await getShortestPath(from, to);
    if (!result) {
      res.status(404).json({ message: "No path found between the specified nodes", code: "NOT_FOUND", status: 404 });
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/graph", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getFullGraph();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
