// src/app.ts
import express, { type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";

import { logger } from "./utils/logger";
import ordersRouter from "./routes/orders.routes";
import { metricsMiddleware, register } from "./utils/metrics";
import { checkHealth } from "./utils/health";

export const app = express();

app.use(cors());
app.use(express.json());

// Logs estruturados (desliga em teste)
const isTest =
  process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined;

if (!isTest) {
  app.use(
    pinoHttp({
      logger,
      customLogLevel: function (_req, res, err) {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
    })
  );
}

// Métricas HTTP (usa Prometheus, expõe em /metrics)
app.use(metricsMiddleware);

app.use("/orders", ordersRouter);

// Healthcheck completo: API + DB + Redis
app.get("/health", async (_req: Request, res: Response) => {
  const health = await checkHealth();

  const statusCode = health.ok ? 200 : 503;

  res.status(statusCode).json({
    status: health.ok ? "ok" : "degraded",
    service: "order-processing-service",
    ts: new Date().toISOString(),
    dependencies: {
      db: health.db,
      redis: health.redis,
    },
  });
});

// Endpoint Prometheus
app.get("/metrics", async (_req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.status(200).send(await register.metrics());
});