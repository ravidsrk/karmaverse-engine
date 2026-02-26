/**
 * API middleware — Auth, rate limiting, and error handling.
 *
 * Tiers (from 03-mcp-server-spec.md):
 *   - Free: 10 calls/day (no API key needed, IP-based)
 *   - Standard: 1,000 calls/day (API key required)
 *   - Premium: 10,000 calls/day (API key + payment)
 */

import { Context, Next } from "hono";

// In-memory rate limit store (would use Redis in production)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

// API key tier mapping (would be database-backed in production)
const apiKeyTiers = new Map<string, { tier: "free" | "standard" | "premium"; userId: string }>();

const TIER_LIMITS: Record<string, number> = {
  free: 10,
  standard: 1000,
  premium: 10000,
};

export interface KarmaVerseError {
  error: string;
  code: string;
  message: string;
  details?: any;
}

export const ERROR_CODES = {
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_API_KEY: "INVALID_API_KEY",
  VERSE_NOT_FOUND: "VERSE_NOT_FOUND",
  DECISION_NOT_FOUND: "DECISION_NOT_FOUND",
  EXERCISE_NOT_FOUND: "EXERCISE_NOT_FOUND",
  CHAPTER_NOT_FOUND: "CHAPTER_NOT_FOUND",
  INVALID_PARAMS: "INVALID_PARAMS",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};

function getClientId(c: Context): string {
  // API key takes priority
  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return `key:${authHeader.slice(7)}`;
  }
  // Fall back to IP
  const ip = c.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ||
    c.req.header("X-Real-IP") || "unknown";
  return `ip:${ip}`;
}

function getTier(clientId: string): { tier: "free" | "standard" | "premium"; userId: string } {
  if (clientId.startsWith("key:")) {
    const key = clientId.slice(4);
    const keyData = apiKeyTiers.get(key);
    if (keyData) return keyData;
    // If key provided but not found, treat as free but note it
    return { tier: "free", userId: "unknown" };
  }
  return { tier: "free", userId: "anonymous" };
}

/**
 * Rate limiting middleware.
 * Free tier: 10/day. Standard: 1000/day. Premium: 10000/day.
 * Disabled in test environment (NODE_ENV=test or VITEST=true).
 */
export async function rateLimitMiddleware(c: Context, next: Next) {
  // Skip rate limiting in tests
  if (process.env.NODE_ENV === "test" || process.env.VITEST === "true") {
    await next();
    return;
  }
  const clientId = getClientId(c);
  const { tier } = getTier(clientId);
  const limit = TIER_LIMITS[tier];
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimits.get(clientId);
  if (!entry || entry.resetAt < now) {
    // Reset daily
    entry = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 };
    rateLimits.set(clientId, entry);
  }

  entry.count++;

  // Set rate limit headers
  c.header("X-RateLimit-Limit", String(limit));
  c.header("X-RateLimit-Remaining", String(Math.max(0, limit - entry.count)));
  c.header("X-RateLimit-Reset", new Date(entry.resetAt).toISOString());

  if (entry.count > limit) {
    return c.json(
      {
        error: "Rate limit exceeded",
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: `${tier} tier allows ${limit} calls/day. Upgrade for higher limits.`,
        details: {
          tier,
          limit,
          used: entry.count,
          resetAt: new Date(entry.resetAt).toISOString(),
        },
      },
      429
    );
  }

  // Add quota info to response
  await next();
}

/**
 * Error handling middleware — wraps tool errors in structured error responses.
 */
export async function errorMiddleware(c: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    console.error("[KarmaVerse API Error]", err);
    return c.json(
      {
        error: err.message || "Internal server error",
        code: ERROR_CODES.INTERNAL_ERROR,
        message: "An unexpected error occurred. Please try again.",
      },
      500
    );
  }
}

/**
 * Register an API key with a tier.
 * In production, this would be backed by a database.
 */
export function registerApiKey(key: string, tier: "free" | "standard" | "premium", userId: string) {
  apiKeyTiers.set(key, { tier, userId });
}

/**
 * Get rate limit stats for a client (for admin/debug).
 */
export function getRateLimitStats(clientId: string): { count: number; limit: number; tier: string; resetAt: string } | null {
  const entry = rateLimits.get(clientId);
  const { tier } = getTier(clientId);
  if (!entry) return null;
  return {
    count: entry.count,
    limit: TIER_LIMITS[tier],
    tier,
    resetAt: new Date(entry.resetAt).toISOString(),
  };
}
