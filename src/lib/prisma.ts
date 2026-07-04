import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Only construct a new pool when there isn't already a cached client —
// otherwise every Turbopack/HMR module reload in dev leaks a fresh pg Pool
// (and its open connections) that never gets used or closed.
function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon suspends its compute after inactivity; waking it back up on the
    // next query can take a few seconds, so give the connection room before
    // giving up instead of racing Neon's own close.
    connectionTimeoutMillis: 15_000,
  });

  // node-postgres requires an 'error' listener on the pool: when a pooled
  // client dies while idle (e.g. Neon closing it after auto-suspend), pg
  // emits 'error' on the pool itself. Without a listener that's an unhandled
  // event that can crash the whole process instead of just failing one query.
  pool.on("error", (err) => {
    console.error("[prisma] pg pool error on idle client:", err.message);
  });

  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
