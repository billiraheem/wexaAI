import { Router, Request, Response, NextFunction } from "express";
import { getAllSystems, getSystemByName } from "../services/system.service";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const systems = await getAllSystems();
    res.json(systems);
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const system = await getSystemByName(req.params.name);
    if (!system) {
      res.status(404).json({ message: "System not found", code: "NOT_FOUND", status: 404 });
      return;
    }
    res.json(system);
  } catch (err) {
    next(err);
  }
});

export default router;
