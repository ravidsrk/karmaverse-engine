/**
 * Database schema — SQLite via better-sqlite3.
 * Matches the Postgres schema from 02-technical-architecture.md
 * but uses SQLite for portability (MCP servers run locally).
 *
 * Tables: decisions, decision_outcomes, karma_scores, api_usage
 */

import Database from "better-sqlite3";
import { join } from "path";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = process.env.KARMAVERSE_DB_PATH || join(process.cwd(), "karmaverse.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Create tables
  db.exec(`
    -- Decision logs (Layer 2: Decide)
    CREATE TABLE IF NOT EXISTS decisions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      context TEXT,
      options TEXT,                     -- JSON array
      biases_flagged TEXT,              -- JSON array
      wisdom_applied TEXT,              -- JSON array
      chosen_option TEXT,
      reasoning TEXT,
      predicted_outcome TEXT,
      confidence_level INTEGER,
      review_after_days INTEGER DEFAULT 90,
      review_date TEXT,
      decided_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Decision outcomes (Layer 3: Reflect)
    CREATE TABLE IF NOT EXISTS decision_outcomes (
      id TEXT PRIMARY KEY,
      decision_id TEXT NOT NULL REFERENCES decisions(id),
      actual_outcome TEXT,
      satisfaction_level INTEGER,
      lessons_learned TEXT,
      would_choose_differently INTEGER DEFAULT 0,
      surprise_factor TEXT,
      reflected_at TEXT DEFAULT (datetime('now'))
    );

    -- Karma Score snapshots (Layer 4: Reputation)
    CREATE TABLE IF NOT EXISTS karma_scores (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      score REAL NOT NULL,
      level TEXT,
      breakdown TEXT,                   -- JSON
      calculated_at TEXT DEFAULT (datetime('now'))
    );

    -- API usage tracking
    CREATE TABLE IF NOT EXISTS api_usage (
      id TEXT PRIMARY KEY,
      api_key TEXT,
      tool_name TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT 'mcp',
      request_params TEXT,              -- JSON
      response_time_ms INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- User profiles
    CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      values TEXT,                      -- JSON array of stated values
      preferences TEXT,                 -- JSON
      streak_data TEXT,                 -- JSON
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Create indices
    CREATE INDEX IF NOT EXISTS idx_decisions_user ON decisions(user_id);
    CREATE INDEX IF NOT EXISTS idx_decisions_review ON decisions(review_date);
    CREATE INDEX IF NOT EXISTS idx_outcomes_decision ON decision_outcomes(decision_id);
    CREATE INDEX IF NOT EXISTS idx_karma_user ON karma_scores(user_id);
    CREATE INDEX IF NOT EXISTS idx_usage_tool ON api_usage(tool_name);
  `);

  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

// --- Decision CRUD ---

export interface DecisionRow {
  id: string;
  user_id: string;
  title: string;
  context: string | null;
  options: string | null;
  biases_flagged: string | null;
  wisdom_applied: string | null;
  chosen_option: string | null;
  reasoning: string | null;
  predicted_outcome: string | null;
  confidence_level: number | null;
  review_after_days: number;
  review_date: string | null;
  decided_at: string | null;
  created_at: string;
}

export interface OutcomeRow {
  id: string;
  decision_id: string;
  actual_outcome: string | null;
  satisfaction_level: number | null;
  lessons_learned: string | null;
  would_choose_differently: number;
  surprise_factor: string | null;
  reflected_at: string;
}

export function insertDecision(d: Partial<DecisionRow> & { id: string; user_id: string; title: string }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO decisions (id, user_id, title, context, options, biases_flagged, wisdom_applied,
      chosen_option, reasoning, predicted_outcome, confidence_level, review_after_days, review_date, decided_at)
    VALUES (@id, @user_id, @title, @context, @options, @biases_flagged, @wisdom_applied,
      @chosen_option, @reasoning, @predicted_outcome, @confidence_level, @review_after_days, @review_date, @decided_at)
  `);
  stmt.run({
    id: d.id,
    user_id: d.user_id,
    title: d.title,
    context: d.context || null,
    options: d.options || null,
    biases_flagged: d.biases_flagged || null,
    wisdom_applied: d.wisdom_applied || null,
    chosen_option: d.chosen_option || null,
    reasoning: d.reasoning || null,
    predicted_outcome: d.predicted_outcome || null,
    confidence_level: d.confidence_level || null,
    review_after_days: d.review_after_days || 90,
    review_date: d.review_date || null,
    decided_at: d.decided_at || new Date().toISOString(),
  });
}

export function getDecision(id: string): DecisionRow | undefined {
  return getDb().prepare("SELECT * FROM decisions WHERE id = ?").get(id) as DecisionRow | undefined;
}

export function getDecisionsByUser(userId: string): DecisionRow[] {
  return getDb().prepare("SELECT * FROM decisions WHERE user_id = ? ORDER BY created_at DESC").all(userId) as DecisionRow[];
}

export function getPendingReviewDecisions(userId: string): DecisionRow[] {
  const now = new Date().toISOString().split("T")[0];
  return getDb().prepare(`
    SELECT d.* FROM decisions d
    LEFT JOIN decision_outcomes o ON d.id = o.decision_id
    WHERE d.user_id = ? AND d.review_date <= ? AND o.id IS NULL
    ORDER BY d.review_date ASC
  `).all(userId, now) as DecisionRow[];
}

export function getUpcomingReviewCount(userId: string): number {
  const now = new Date().toISOString().split("T")[0];
  const row = getDb().prepare(`
    SELECT COUNT(*) as cnt FROM decisions d
    LEFT JOIN decision_outcomes o ON d.id = o.decision_id
    WHERE d.user_id = ? AND d.review_date > ? AND o.id IS NULL
  `).get(userId, now) as { cnt: number };
  return row.cnt;
}

export function insertOutcome(o: Partial<OutcomeRow> & { id: string; decision_id: string }) {
  const db = getDb();
  db.prepare(`
    INSERT INTO decision_outcomes (id, decision_id, actual_outcome, satisfaction_level,
      lessons_learned, would_choose_differently, surprise_factor)
    VALUES (@id, @decision_id, @actual_outcome, @satisfaction_level,
      @lessons_learned, @would_choose_differently, @surprise_factor)
  `).run({
    id: o.id,
    decision_id: o.decision_id,
    actual_outcome: o.actual_outcome || null,
    satisfaction_level: o.satisfaction_level || null,
    lessons_learned: o.lessons_learned || null,
    would_choose_differently: o.would_choose_differently ? 1 : 0,
    surprise_factor: o.surprise_factor || null,
  });
}

export function getOutcome(decisionId: string): OutcomeRow | undefined {
  return getDb().prepare("SELECT * FROM decision_outcomes WHERE decision_id = ?").get(decisionId) as OutcomeRow | undefined;
}

export function getDecisionsWithOutcomes(userId: string): Array<DecisionRow & { outcome: OutcomeRow | null }> {
  const decisions = getDecisionsByUser(userId);
  return decisions.map((d) => {
    const outcome = getOutcome(d.id) || null;
    return { ...d, outcome };
  });
}

export function getReflectedDecisions(userId: string): Array<DecisionRow & { outcome: OutcomeRow }> {
  const all = getDecisionsWithOutcomes(userId);
  return all.filter((d): d is DecisionRow & { outcome: OutcomeRow } => d.outcome !== null);
}

export function insertKarmaScore(s: { id: string; user_id: string; score: number; level: string; breakdown: string }) {
  getDb().prepare(`
    INSERT INTO karma_scores (id, user_id, score, level, breakdown)
    VALUES (@id, @user_id, @score, @level, @breakdown)
  `).run(s);
}

export function getLatestKarmaScore(userId: string): { score: number; level: string; breakdown: string; calculated_at: string } | undefined {
  return getDb().prepare("SELECT score, level, breakdown, calculated_at FROM karma_scores WHERE user_id = ? ORDER BY calculated_at DESC LIMIT 1").get(userId) as any;
}

export function logApiUsage(toolName: string, channel: string = "mcp", apiKey?: string, params?: any, responseTimeMs?: number) {
  const id = `usage_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  getDb().prepare(`
    INSERT INTO api_usage (id, api_key, tool_name, channel, request_params, response_time_ms)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, apiKey || null, toolName, channel, params ? JSON.stringify(params) : null, responseTimeMs || null);
}
