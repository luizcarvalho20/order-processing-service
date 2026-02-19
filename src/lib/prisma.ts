// src/lib/prisma.ts
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";

// Pool do Postgres (abre sockets)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Prisma Client
const prisma = new PrismaClient();

// Fecha tudo (usado pelo Jest/teardown)
async function closeDb() {
  try {
    await prisma.$disconnect();
  } catch {}

  try {
    await pool.end();
  } catch {}
}

module.exports = {
  prisma,
  pool,
  closeDb,
};
