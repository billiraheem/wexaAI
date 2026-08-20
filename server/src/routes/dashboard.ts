import { Router, Request, Response, NextFunction } from "express";
import { getStats, getHighlights } from "../services/dashboard.service";

const router = Router();

router.get("/stats", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

router.get("/highlights", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const highlights = await getHighlights();
    res.json(highlights);
  } catch (err) {
    next(err);
  }
});

export default router;

