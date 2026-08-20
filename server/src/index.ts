import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import { verifyConnectivity, closeDriver } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import dashboardRoutes from "./routes/dashboard";
import agentRoutes from "./routes/agents";
import workflowRoutes from "./routes/workflows";
import systemRoutes from "./routes/systems";
import analysisRoutes from "./routes/analysis";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/systems", systemRoutes);
app.use("/api/analysis", analysisRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

async function start() {
  try {
    await verifyConnectivity();
    console.log("Connected to CognoDB");
  } catch (err) {
    console.error("Failed to connect to CognoDB:", err);
    console.warn("Starting server anyway: queries will fail until DB is available");
  }

  app.listen(PORT, () => {
    console.log(`AutomatIQ API running on port ${PORT}`);
  });
}

process.on("SIGTERM", async () => {
  console.log("Shutting down");
  await closeDriver();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Shutting down");
  await closeDriver();
  process.exit(0);
});

start();
