"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/workers/orderWorker.ts
require("dotenv/config");
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const orderQueue_1 = require("../queues/orderQueue");
// ✅ Seu prisma.ts é CommonJS (module.exports = { prisma })
// Então a forma mais segura aqui é require:
const { prisma } = require("../lib/prisma");
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const worker = new bullmq_1.Worker(orderQueue_1.ORDER_QUEUE_NAME, async (job) => {
    if (job.name !== orderQueue_1.ORDER_JOB_PROCESS_ORDER)
        return;
    const { orderId } = job.data;
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
}, {
    connection: redis_1.redisConnection,
});
worker.on("ready", () => console.log("[worker] ready"));
worker.on("completed", (job) => console.log(`[worker] completed job ${job.id}`));
worker.on("failed", (job, err) => console.error(`[worker] failed job ${job?.id}`, err));
console.log("[worker] Order worker running...");
//# sourceMappingURL=orderWorker.js.map