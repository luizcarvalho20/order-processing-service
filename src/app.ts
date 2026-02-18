import express, { type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";

import { logger } from "./utils/logger";
import ordersRouter from "./routes/orders.routes";

export const app = express();

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

app.use("/orders", ordersRouter);

// Healthcheck básico (vamos evoluir no Dia 20)
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "order-processing-service",
    ts: new Date().toISOString(),
  });
});
