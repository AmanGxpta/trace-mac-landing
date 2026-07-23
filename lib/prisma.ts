import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres connection string in your environment (e.g. Vercel Project Settings → Environment Variables).",
    );
  }

  if (
    /localhost|127\.0\.0\.1/.test(connectionString) &&
    process.env.VERCEL === "1"
  ) {
    throw new Error(
      "DATABASE_URL points to localhost on Vercel. Use a hosted Postgres URL instead.",
    );
  }

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      // Serverless-friendly: keep the pool small.
      max: 1,
      ssl: connectionString.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
