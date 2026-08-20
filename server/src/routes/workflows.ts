import { Router, Request, Response, NextFunction } from "express";
import { getAllWorkflows, getWorkflowByName } from "../services/workflow.service";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const workflows = await getAllWorkflows();
    res.json(workflows);
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await getWorkflowByName(req.params.name);
    if (!workflow) {
      res.status(404).json({ message: "Workflow not found", code: "NOT_FOUND", status: 404 });
      return;
    }
    res.json(workflow);
  } catch (err) {
    next(err);
  }
});

export default router;
