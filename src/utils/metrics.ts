// src/utils/metrics.ts
import client from "prom-client";
import type { Request, Response, NextFunction } from "express";

// Coleta métricas padrão do Node
client.collectDefaultMetrics({
  prefix: "order_processing_",
});

export const register = client.register;

// Histogram de latência HTTP
const httpRequestDurationMs = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duração das requisições HTTP em ms",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [10, 25, 50, 100, 200, 400, 800, 1500, 3000, 5000],
});

// Middleware para medir tempo
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    // route pode não existir (ex: 404)
    const route = (req.route?.path ? String(req.route.path) : req.path) || "unknown";

    httpRequestDurationMs.labels(
      req.method,
      route,
      String(res.statusCode)
    ).observe(Date.now() - start);
  });

  next();
}