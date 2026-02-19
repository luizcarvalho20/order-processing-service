// tests/jest.teardown.js
module.exports = async function globalTeardown() {
  // Fecha BullMQ Queue
  try {
    const queueMod = require("../src/queues/orderQueue");
    if (typeof queueMod.closeOrderQueue === "function") {
      await queueMod.closeOrderQueue();
    }
  } catch {}

  // Fecha Prisma + Pool do Postgres
  try {
    const db = require("../src/lib/prisma");
    if (typeof db.closeDb === "function") {
      await db.closeDb();
    } else {
      // fallback
      if (db?.prisma?.$disconnect) await db.prisma.$disconnect();
      if (db?.pool?.end) await db.pool.end();
    }
  } catch {}
};
