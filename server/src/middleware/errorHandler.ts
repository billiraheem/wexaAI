import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isConnectionError =
    err.message.includes("connect") ||
    err.message.includes("ECONNREFUSED") ||
    err.message.includes("ServiceUnavailable") ||
    err.message.includes("SessionExpired") ||
    err.message.includes("No routing servers available");

  if (isConnectionError) {
    res.status(503).json({
      message: "Database is currently unreachable. Please try again later.",
      code: "DB_UNREACHABLE",
      status: 503,
    });
    return;
  }

  console.error("Unhandled error:", err.message);
  res.status(500).json({
    message: "An unexpected error occurred.",
    code: "INTERNAL_ERROR",
    status: 500,
  });
}
