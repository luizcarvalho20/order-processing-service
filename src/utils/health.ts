// src/utils/health.ts
import "dotenv/config";
import Redis from "ioredis";

// prisma é CommonJS no seu projeto
const { prisma } = require("../lib/prisma") as { prisma: any };

type HealthResult = {
  ok: boolean;
  db: { ok: boolean; latencyMs?: number; error?: string };
  redis: { ok: boolean; latencyMs?: number; error?: string };
};

export async function checkHealth(): Promise<HealthResult> {
  const db = { ok: false as boolean, latencyMs: undefined as number | undefined, error: undefined as string | undefined };
  const redis = { ok: false as boolean, latencyMs: undefined as number | undefined, error: undefined as string | undefined };

  // DB check (SELECT 1)
  try {
    const t0 = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    db.ok = true;
    db.latencyMs = Date.now() - t0;
  } catch (e: any) {
    db.ok = false;
    db.error = e?.message ? String(e.message) : "db_error";
  }

  // Redis check (PING) com conexão curta só pro health (não mexe na BullMQ)
  const host = process.env.REDIS_HOST || "localhost";
  const port = Number(process.env.REDIS_PORT || 6379);

  const r = new Redis({ host, port, maxRetriesPerRequest: 1, lazyConnect: false });
  try {
    const t0 = Date.now();
    const pong = await r.ping();
    if (pong === "PONG") redis.ok = true;
    redis.latencyMs = Date.now() - t0;
  } catch (e: any) {
    redis.ok = false;
    redis.error = e?.message ? String(e.message) : "redis_error";
  } finally {
    try {
      await r.quit();
    } catch {
      try {
        r.disconnect();
      } catch {}
    }
  }

  return { ok: db.ok && redis.ok, db, redis };
}