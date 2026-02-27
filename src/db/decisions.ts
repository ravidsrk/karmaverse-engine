/**
 * Decision data access layer.
 * Uses Prisma (Neon Postgres) when available, falls back to in-memory Map.
 *
 * Every tool that touches decisions imports from here.
 */

import { getPrisma } from "./client";

// Unified decision type used by all tools
export interface StoredDecision {
  id: string;
  userId: string;
  title: string;
  context?: string | null;
  options?: string[];
  chosenOption: string;
  reasoning?: string | null;
  predictedOutcome?: string | null;
  confidenceLevel?: number | null;
  biasesFlagged?: string[];
  reviewDate?: string | null;
  loggedAt: string;
  outcome: {
    actualOutcome: string;
    satisfaction: number;
    lessons?: string | null;
    wouldChooseDifferently: boolean;
    surpriseFactor?: string | null;
    reflectedAt: string;
  } | null;
}

// ── In-memory fallback ────────────────────────────────────────────
const memoryStore = new Map<string, StoredDecision>();

/** Exposed for tests that need to clear state */
export function getMemoryStore(): Map<string, StoredDecision> {
  return memoryStore;
}

// ── CRUD operations ───────────────────────────────────────────────

export async function createDecision(d: Omit<StoredDecision, "outcome">): Promise<StoredDecision> {
  const prisma = getPrisma();

  if (prisma) {
    const row = await prisma.decision.create({
      data: {
        id: d.id,
        userId: d.userId,
        title: d.title,
        context: d.context,
        options: d.options || [],
        chosenOption: d.chosenOption,
        reasoning: d.reasoning,
        predictedOutcome: d.predictedOutcome,
        confidenceLevel: d.confidenceLevel,
        biasesFlagged: d.biasesFlagged || [],
        reviewDate: d.reviewDate ? new Date(d.reviewDate) : null,
        loggedAt: new Date(d.loggedAt),
      },
    });
    return toStoredDecision(row, null);
  }

  // Fallback
  const stored: StoredDecision = { ...d, outcome: null };
  memoryStore.set(d.id, stored);
  return stored;
}

export async function getDecisionById(id: string): Promise<StoredDecision | null> {
  const prisma = getPrisma();

  if (prisma) {
    const row = await prisma.decision.findUnique({
      where: { id },
      include: { outcome: true },
    });
    if (!row) return null;
    return toStoredDecision(row, row.outcome);
  }

  return memoryStore.get(id) || null;
}

export async function getDecisionsByUser(userId: string): Promise<StoredDecision[]> {
  const prisma = getPrisma();

  if (prisma) {
    const rows = await prisma.decision.findMany({
      where: { userId },
      include: { outcome: true },
      orderBy: { loggedAt: "desc" },
    });
    return rows.map((r) => toStoredDecision(r, r.outcome));
  }

  return Array.from(memoryStore.values()).filter((d) => d.userId === userId);
}

export async function saveOutcome(
  decisionId: string,
  outcome: NonNullable<StoredDecision["outcome"]>
): Promise<StoredDecision | null> {
  const prisma = getPrisma();

  if (prisma) {
    await prisma.decisionOutcome.create({
      data: {
        decisionId,
        actualOutcome: outcome.actualOutcome,
        satisfaction: outcome.satisfaction,
        lessons: outcome.lessons,
        wouldChooseDifferently: outcome.wouldChooseDifferently,
        surpriseFactor: outcome.surpriseFactor,
        reflectedAt: new Date(outcome.reflectedAt),
      },
    });
    const updated = await prisma.decision.findUnique({
      where: { id: decisionId },
      include: { outcome: true },
    });
    return updated ? toStoredDecision(updated, updated.outcome) : null;
  }

  // Fallback
  const decision = memoryStore.get(decisionId);
  if (!decision) return null;
  decision.outcome = outcome;
  return decision;
}

export async function getDecisionsInPeriod(
  userId: string,
  periodStart: Date
): Promise<StoredDecision[]> {
  const prisma = getPrisma();

  if (prisma) {
    const rows = await prisma.decision.findMany({
      where: {
        userId,
        loggedAt: { gte: periodStart },
      },
      include: { outcome: true },
      orderBy: { loggedAt: "desc" },
    });
    return rows.map((r) => toStoredDecision(r, r.outcome));
  }

  return Array.from(memoryStore.values()).filter(
    (d) => d.userId === userId && new Date(d.loggedAt) >= periodStart
  );
}

export async function getPendingDecisions(userId: string): Promise<StoredDecision[]> {
  const prisma = getPrisma();

  if (prisma) {
    const rows = await prisma.decision.findMany({
      where: {
        userId,
        outcome: null, // No outcome yet
        reviewDate: { lte: new Date() },
      },
      orderBy: { reviewDate: "asc" },
    });
    return rows.map((r) => toStoredDecision(r, null));
  }

  const now = new Date();
  return Array.from(memoryStore.values()).filter(
    (d) =>
      d.userId === userId &&
      d.outcome === null &&
      d.reviewDate &&
      new Date(d.reviewDate) <= now
  );
}

// ── Helpers ───────────────────────────────────────────────────────

function toStoredDecision(row: any, outcome: any): StoredDecision {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    context: row.context,
    options: row.options,
    chosenOption: row.chosenOption,
    reasoning: row.reasoning,
    predictedOutcome: row.predictedOutcome,
    confidenceLevel: row.confidenceLevel,
    biasesFlagged: row.biasesFlagged,
    reviewDate: row.reviewDate?.toISOString?.()?.split("T")[0] || row.reviewDate,
    loggedAt: row.loggedAt?.toISOString?.() || row.loggedAt,
    outcome: outcome
      ? {
          actualOutcome: outcome.actualOutcome,
          satisfaction: outcome.satisfaction,
          lessons: outcome.lessons,
          wouldChooseDifferently: outcome.wouldChooseDifferently,
          surpriseFactor: outcome.surpriseFactor,
          reflectedAt: outcome.reflectedAt?.toISOString?.() || outcome.reflectedAt,
        }
      : null,
  };
}
