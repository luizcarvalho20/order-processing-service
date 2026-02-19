// src/workers/orderWorker.ts
import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { ORDER_QUEUE_NAME, ORDER_JOB_PROCESS_ORDER } from "../queues/orderQueue";

// prisma é CommonJS (module.exports = { prisma })
const { prisma } = require("../lib/prisma") as { prisma: any };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createOrderWorker() {
  const worker = new Worker(
    ORDER_QUEUE_NAME,
    async (job) => {
      if (job.name !== ORDER_JOB_PROCESS_ORDER) return;

      const { orderId } = job.data as { orderId: string };

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" },
      });

      await sleep(2000);

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      });

      return { ok: true };
    },
    { connection: redisConnection }
  );

  worker.on("ready", () => console.log("[worker] ready"));
  worker.on("completed", (job) => console.log(`[worker] completed job ${job.id}`));
  worker.on("failed", (job, err) =>
    console.error(`[worker] failed job ${job?.id}`, err)
  );

  console.log("[worker] Order worker running...");
  return worker;
}

// ✅ fecha worker + clients internos (resolve Jest pendurado)
export async function closeOrderWorker(worker: any) {
  if (!worker) return;

  // 1) close “oficial”
  try {
    await worker.close();
  } catch {}

  // 2) mata conexões internas ioredis (client + blockingConnection)
  try {
    const client = await worker.client;
    if (client?.quit) await client.quit();
    else if (client?.disconnect) client.disconnect();
  } catch {}

  try {
    const bc = await worker.blockingConnection;
    const bcClient = bc?.client ?? bc; // dependendo da versão
    if (bcClient?.quit) await bcClient.quit();
    else if (bcClient?.disconnect) bcClient.disconnect();
  } catch {}
}

// Se executar via CLI (npm run worker:dev), roda como processo “infinito”
if (require.main === module) {
  createOrderWorker();
}
