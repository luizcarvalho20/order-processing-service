// tests/jest.teardown.ts
async function globalTeardown() {
  // 1) Fecha BullMQ Queue
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const queueMod = require("../src/queues/orderQueue");

    if (typeof queueMod.closeOrderQueue === "function") {
      await queueMod.closeOrderQueue();
    } else if (typeof queueMod.getOrderQueue === "function") {
      const q = queueMod.getOrderQueue();
      if (q?.close) await q.close();
    }
  } catch (err) {
    // opcional: console.error("[teardown] erro ao fechar queue", err);
  }

  // 2) Fecha Prisma
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const prismaMod = require("../src/lib/prisma");

    if (prismaMod?.prisma?.$disconnect) {
      await prismaMod.prisma.$disconnect();
    }
  } catch (err) {
    // opcional: console.error("[teardown] erro ao desconectar prisma", err);
  }
}

module.exports = globalTeardown;
