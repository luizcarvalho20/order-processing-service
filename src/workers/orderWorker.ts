// src/workers/orderWorker.ts
import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { ORDER_QUEUE_NAME, ORDER_JOB_PROCESS_ORDER } from "../queues/orderQueue";

// ✅ Seu prisma.ts é CommonJS (module.exports = { prisma })
// Então a forma mais segura aqui é require:
const { prisma } = require("../lib/prisma") as { prisma: any };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const worker = new Worker(
  ORDER_QUEUE_NAME,
  async (job) => {
    if (job.name !== ORDER_JOB_PROCESS_ORDER) return;

    const { orderId } = job.data as { orderId: string };

    // 1) marca PROCESSING
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PROCESSING" },
    });

    // 2) simula processamento real
    await sleep(2000);

    // 3) finaliza
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    return { ok: true };
  },
  {
    connection: redisConnection,
  }
);

worker.on("ready", () => console.log("[worker] ready"));
worker.on("completed", (job) => console.log(`[worker] completed job ${job.id}`));
worker.on("failed", (job, err) =>
  console.error(`[worker] failed job ${job?.id}`, err)
);

console.log("[worker] Order worker running...");
