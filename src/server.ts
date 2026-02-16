require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const { logger } = require("./utils/logger");
const pinoHttp = require("pino-http");
const ordersRouter = require("./routes/orders.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  pinoHttp({
    logger,
    customLogLevel: function (_req: any, res: any, err: any) {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  })
);

app.use("/orders", ordersRouter);

// Healthcheck básico (vamos evoluir no Dia 20)
app.get("/health", (_req: import("express").Request, res: import("express").Response) => {
  res.status(200).json({
    status: "ok",
    service: "order-processing-service",
    ts: new Date().toISOString(),
  });
});

app.listen(env.port, () => {
  logger.info({ port: env.port }, "HTTP server running");
});
