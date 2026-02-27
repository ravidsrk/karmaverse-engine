/**
 * Prisma client singleton — Neon PostgreSQL via @prisma/adapter-pg.
 *
 * Uses DATABASE_URL from environment.
 * Falls back gracefully if no database is configured —
 * tools will use in-memory fallback.
 */

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;
let initAttempted = false;

/**
 * Get the Prisma client instance.
 * Returns null if DATABASE_URL is not set (allows graceful fallback).
 */
export function getPrisma(): PrismaClient | null {
  if (prisma) return prisma;
  if (initAttempted) return null; // Already tried and failed
  initAttempted = true;

  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    // Prisma 7 requires adapter for direct connections
    // Dynamic import to avoid bundling pg in MCP server if not needed
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pg = require("pg");
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
    const adapter = new PrismaPg(pool, { schema: "karmaverse" });
    prisma = new PrismaClient({ adapter });
    return prisma;
  } catch (e: any) {
    console.warn("[KarmaVerse] Failed to initialize Prisma client — using in-memory fallback");
    return null;
  }
}

/**
 * Check if database is available.
 */
export function isDbAvailable(): boolean {
  return getPrisma() !== null;
}

/**
 * Disconnect Prisma client (for cleanup).
 */
export async function disconnectDb(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    initAttempted = false;
  }
}
