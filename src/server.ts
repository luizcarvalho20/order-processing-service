import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import pinoHttp from "pino-http";

const app = express();

app.use(cors());
app.use(express.json());
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

// Healthcheck básico (vamos evoluir no Dia 20)
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "order-processing-service",
    ts: new Date().toISOString(),
  });
});

app.listen(env.port, () => {
  logger.info({ port: env.port }, "HTTP server running");
});
