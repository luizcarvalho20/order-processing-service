"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL não definida no .env");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
module.exports = { prisma };
//# sourceMappingURL=prisma.js.map