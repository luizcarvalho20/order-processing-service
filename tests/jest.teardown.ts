async function globalTeardown() {
  // 1) Fecha BullMQ Queue (import CommonJS-safe)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const queueMod = require("../src/queues/orderQueue") as {
      closeOrderQueue?: () => Promise<void>;
      getOrderQueue?: () => any;
    };

    if (typeof queueMod.closeOrderQueue === "function") {
      await queueMod.closeOrderQueue();
    } else {
      // fallback: se só existir getOrderQueue, tenta fechar a instância
      if (typeof queueMod.getOrderQueue === "function") {
        const q = queueMod.getOrderQueue();
        if (q?.close) await q.close();
      }
    }
  } catch {}

  // 2) Fecha Prisma + Pool do Postgres (CommonJS)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const prismaMod = require("../src/lib/prisma") as {
      prisma?: { $disconnect?: () => Promise<void> };
      pool?: { end?: () => Promise<void> };
    };

    if (prismaMod?.prisma?.$disconnect) {
      await prismaMod.prisma.$disconnect();
    }
    if (prismaMod?.pool?.end) {
      await prismaMod.pool.end();
    }
  } catch {}
}

module.exports = globalTeardown;
