import { Hono } from "hono";
import { cors } from "hono/cors";
import * as tools from "../tools/index.js";

/**
 * REST API Server — api.karmaverse.ai
 *
 * Exposes all Karma Engine tools as REST endpoints.
 * Payment: Free tier (10 calls/day) → x402 USDC → $KARMA discount.
 */

const app = new Hono();

// Middleware
app.use("*", cors());

// Health check
app.get("/", (c) =>
  c.json({
    name: "KarmaVerse Karma Engine API",
    version: "1.0.0",
    layers: ["ground", "decide", "reflect"],
    tools: 15,
    docs: "https://karmaverse.ai/docs",
  })
);

// === GROUND LAYER ===

app.get("/api/v2/verse-of-day", async (c) => {
  const tradition = (c.req.query("tradition") as any) || "any";
  const result = await tools.verseOfTheDay.execute!({ tradition }, {} as any);
  return c.json(result);
});

app.get("/api/v2/wisdom/search", async (c) => {
  const query = c.req.query("q") || "";
  const mood = c.req.query("mood") as any;
  const tradition = (c.req.query("tradition") as any) || "all";
  const limit = parseInt(c.req.query("limit") || "3");
  const result = await tools.searchWisdom.execute!({ query, mood, tradition, limit }, {} as any);
  return c.json(result);
});

app.get("/api/v2/verse", async (c) => {
  const tradition = c.req.query("tradition") as any;
  const reference = c.req.query("reference");
  const id = c.req.query("id");
  if (!tradition && !id) return c.json({ error: "tradition or id required" }, 400);
  const result = await tools.getVerse.execute!({ tradition, reference, id }, {} as any);
  return c.json(result);
});

app.get("/api/v2/breathing", async (c) => {
  const useCase = c.req.query("use_case") as any;
  const mood = c.req.query("mood") as any;
  const difficulty = (c.req.query("difficulty") as any) || "beginner";
  const slug = c.req.query("slug");
  const result = await tools.getBreathingExercise.execute!({ useCase, mood, difficulty, slug }, {} as any);
  return c.json(result);
});

app.post("/api/v2/meditation", async (c) => {
  const body = await c.req.json();
  const result = await tools.getMeditation.execute!(
    {
      category: body.category || "stress_relief",
      durationMinutes: body.duration_minutes || 5,
      mood: body.mood,
      context: body.context,
    },
    {} as any
  );
  return c.json(result);
});

app.get("/api/v2/affirmation", async (c) => {
  const category = c.req.query("category") as any;
  const mood = c.req.query("mood");
  const tradition = (c.req.query("tradition") as any) || "any";
  const result = await tools.getAffirmation.execute!({ category, mood, tradition }, {} as any);
  return c.json(result);
});

app.post("/api/v2/mindfulness/check-in", async (c) => {
  const body = await c.req.json();
  const result = await tools.mindfulnessCheckIn.execute!(
    {
      mood: body.mood,
      energy: body.energy,
      context: body.context,
    },
    {} as any
  );
  return c.json(result);
});

// === DECIDE LAYER ===

app.post("/api/v2/decide/framework", async (c) => {
  const body = await c.req.json();
  const result = await tools.createDecisionFramework.execute!(
    {
      decision: body.decision,
      options: body.options,
      context: body.context,
      userValues: body.user_values,
      urgency: body.urgency || "weeks",
    },
    {} as any
  );
  return c.json(result);
});

app.post("/api/v2/decide/biases", async (c) => {
  const body = await c.req.json();
  const result = await tools.detectBiases.execute!(
    { reasoning: body.reasoning, decisionContext: body.context },
    {} as any
  );
  return c.json(result);
});

app.post("/api/v2/decide/log", async (c) => {
  const body = await c.req.json();
  const result = await tools.logDecision.execute!(
    {
      userId: body.user_id || "default",
      title: body.title,
      chosenOption: body.chosen_option,
      reasoning: body.reasoning,
      predictedOutcome: body.predicted_outcome,
      confidenceLevel: body.confidence_level,
      biasesFlagged: body.biases_flagged,
      reviewAfterDays: body.review_after_days || 30,
    },
    {} as any
  );
  return c.json(result);
});

app.post("/api/v2/decide/counsel", async (c) => {
  const body = await c.req.json();
  const result = await tools.getWisdomCounsel.execute!(
    {
      dilemma: body.dilemma,
      traditions: body.traditions || ["gita", "stoic", "buddhist"],
      depth: body.depth || "brief",
    },
    {} as any
  );
  return c.json(result);
});

// === REFLECT LAYER ===

app.post("/api/v2/reflect/outcome", async (c) => {
  const body = await c.req.json();
  const result = await tools.logOutcome.execute!(
    {
      decisionId: body.decision_id,
      actualOutcome: body.actual_outcome,
      satisfaction: body.satisfaction,
      lessons: body.lessons,
      wouldChooseDifferently: body.would_choose_differently || false,
      surpriseFactor: body.surprise_factor,
    },
    {} as any
  );
  return c.json(result);
});

app.get("/api/v2/reflect/patterns", async (c) => {
  const userId = c.req.query("user_id") || "default";
  const result = await tools.detectPatterns.execute!({ userId }, {} as any);
  return c.json(result);
});

app.get("/api/v2/reflect/report", async (c) => {
  const userId = c.req.query("user_id") || "default";
  const period = (c.req.query("period") as any) || "weekly";
  const result = await tools.generateReflection.execute!({ userId, period }, {} as any);
  return c.json(result);
});

app.get("/api/v2/reflect/pending", async (c) => {
  const userId = c.req.query("user_id") || "default";
  const result = await tools.getPendingReflections.execute!({ userId }, {} as any);
  return c.json(result);
});

export { app };
