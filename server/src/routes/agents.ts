import { Router, Request, Response, NextFunction } from "express";
import { getAllAgents, getAgentByName } from "../services/agent.service";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const agents = await getAllAgents();
    res.json(agents);
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agent = await getAgentByName(req.params.name);
    if (!agent) {
      res.status(404).json({ message: "Agent not found", code: "NOT_FOUND", status: 404 });
      return;
    }
    res.json(agent);
  } catch (err) {
    next(err);
  }
});

export default router;
