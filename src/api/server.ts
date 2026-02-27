import { Hono } from "hono";
import { cors } from "hono/cors";
import * as tools from "../tools/index.js";
import { wisdomVerses, breathworkExercises, meditationTemplates, affirmations, cognitiveBiases } from "../data/index";
import { getDecisionsByUser, getDecisionById } from "../db";
import { rateLimitMiddleware, errorMiddleware } from "./middleware";

/**
 * REST API Server — api.karmaverse.ai
 *
 * Exposes all Karma Engine tools as REST endpoints.
 * ~30 endpoints across Ground, Decide, Reflect, Reputation layers + catalog/utility.
 *
 * Auth: API key via Bearer token. Free tier: 10 calls/day (no key needed).
 * Rate limits: Free (10/day), Standard (1,000/day), Premium (10,000/day).
 */

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("/api/*", errorMiddleware);
app.use("/api/*", rateLimitMiddleware);

// =====================================================
// HEALTH & INFO
// =====================================================

app.get("/", (c) =>
  c.json({
    name: "KarmaVerse Karma Engine API",
    version: "2.0.0",
    layers: ["ground", "decide", "reflect", "reputation"],
    tools: 16,
    docs: "https://karmaverse.ai/docs",
    endpoints: {
      ground: ["/api/v2/wisdom/search", "/api/v2/verse", "/api/v2/verse-of-day", "/api/v2/breathing", "/api/v2/meditation", "/api/v2/affirmation", "/api/v2/mindfulness/check-in"],
      decide: ["/api/v2/decide/framework", "/api/v2/decide/biases", "/api/v2/decide/log", "/api/v2/decide/counsel"],
      reflect: ["/api/v2/reflect/outcome", "/api/v2/reflect/patterns", "/api/v2/reflect/report", "/api/v2/reflect/pending"],
      reputation: ["/api/v2/karma-score/:user_id"],
      catalog: ["/api/v2/wisdom/traditions", "/api/v2/breathwork/exercises", "/api/v2/breathwork/recommend", "/api/v2/meditation/styles", "/api/v2/affirmation/categories"],
    },
  })
);

app.get("/api/v2/health", (c) =>
  c.json({
    status: "ok",
    version: "2.0.0",
    uptime: process.uptime(),
    content: {
      verses: wisdomVerses.length,
      affirmations: affirmations.length,
      meditations: meditationTemplates.length,
      breathwork: breathworkExercises.length,
      biases: cognitiveBiases.length,
    },
  })
);

// =====================================================
// GROUND LAYER (Layer 1)
// =====================================================

// --- Wisdom ---

app.get("/api/v2/wisdom/search", async (c) => {
  const query = c.req.query("q") || "";
  const mood = c.req.query("mood") as any;
  const tradition = (c.req.query("tradition") as any) || "all";
  const limit = parseInt(c.req.query("limit") || "3");
  const persona = c.req.query("persona") as any;
  const result = await tools.searchWisdom.execute!({ query, mood, tradition, limit, persona }, {} as any);
  return c.json(result);
});

app.get("/api/v2/verse", async (c) => {
  const tradition = c.req.query("tradition") as any;
  const reference = c.req.query("reference");
  const id = c.req.query("id");
  const userContext = c.req.query("user_context");
  const persona = c.req.query("persona") as any;
  if (!tradition && !id) return c.json({ error: "INVALID_PARAMS", message: "tradition or id required" }, 400);
  const result = await tools.getVerse.execute!({ tradition, reference, id, userContext, persona }, {} as any);
  return c.json(result);
});

app.get("/api/v2/verse-of-day", async (c) => {
  const tradition = (c.req.query("tradition") as any) || "any";
  const result = await tools.verseOfTheDay.execute!({ tradition }, {} as any);
  return c.json(result);
});

// Fetch verse by tradition and specific reference path
app.get("/api/v2/wisdom/verse/:tradition/:reference", async (c) => {
  const tradition = c.req.param("tradition") as any;
  const reference = c.req.param("reference");
  const userContext = c.req.query("user_context");
  const persona = c.req.query("persona") as any;
  const result = await tools.getVerse.execute!({ tradition, reference, userContext, persona }, {} as any);
  return c.json(result);
});

// List available traditions with counts
app.get("/api/v2/wisdom/traditions", (c) => {
  const traditions = ["gita", "stoic", "buddhist", "yoga_sutras"] as const;
  const data = traditions.map((t) => ({
    id: t,
    name: t === "gita" ? "Bhagavad Gita" : t === "stoic" ? "Stoic Philosophy" : t === "buddhist" ? "Buddhist Wisdom" : "Yoga Sutras of Patanjali",
    verseCount: wisdomVerses.filter((v) => v.tradition === t).length,
    themes: [...new Set(wisdomVerses.filter((v) => v.tradition === t).flatMap((v) => v.themes))].slice(0, 10),
  }));
  return c.json({ traditions: data, totalVerses: wisdomVerses.length });
});

// Cross-tradition concept mapping
app.get("/api/v2/wisdom/cross-tradition/:concept", async (c) => {
  const concept = c.req.param("concept").toLowerCase();
  const matches = wisdomVerses.filter((v) =>
    v.themes.some((t) => t.includes(concept)) ||
    v.text.toLowerCase().includes(concept) ||
    v.interpretation.toLowerCase().includes(concept)
  );
  const byTradition: Record<string, typeof matches> = {};
  for (const m of matches) {
    if (!byTradition[m.tradition]) byTradition[m.tradition] = [];
    byTradition[m.tradition].push(m);
  }
  return c.json({
    concept,
    totalMatches: matches.length,
    byTradition: Object.fromEntries(
      Object.entries(byTradition).map(([k, v]) => [k, v.slice(0, 3).map((verse) => ({
        reference: verse.reference,
        text: verse.text.slice(0, 200) + (verse.text.length > 200 ? "..." : ""),
        interpretation: verse.interpretation,
        themes: verse.themes,
      }))])
    ),
  });
});

// --- Breathwork ---

app.get("/api/v2/breathing", async (c) => {
  const useCase = c.req.query("use_case") as any;
  const mood = c.req.query("mood") as any;
  const difficulty = (c.req.query("difficulty") as any) || "beginner";
  const slug = c.req.query("slug");
  const result = await tools.getBreathingExercise.execute!({ useCase, mood, difficulty, slug }, {} as any);
  return c.json(result);
});

// List all breathwork exercises
app.get("/api/v2/breathwork/exercises", (c) => {
  return c.json({
    exercises: breathworkExercises.map((e) => ({
      slug: e.slug,
      name: e.name,
      description: e.description,
      difficulty: e.difficulty,
      totalDurationSeconds: e.totalDurationSeconds,
      useCases: e.useCases,
      steps: e.steps.length,
    })),
    total: breathworkExercises.length,
  });
});

// Get specific exercise by slug
app.get("/api/v2/breathwork/exercise/:slug", (c) => {
  const slug = c.req.param("slug");
  const exercise = breathworkExercises.find((e) => e.slug === slug);
  if (!exercise) return c.json({ error: "EXERCISE_NOT_FOUND", message: `No exercise with slug '${slug}'` }, 404);
  return c.json({ exercise });
});

// Recommend breathwork based on mood/use case
app.get("/api/v2/breathwork/recommend", async (c) => {
  const mood = c.req.query("mood") as any;
  const useCase = c.req.query("use_case") as any;
  const result = await tools.getBreathingExercise.execute!({ mood, useCase, difficulty: "beginner" }, {} as any);
  return c.json(result);
});

// --- Meditation ---

app.post("/api/v2/meditation", async (c) => {
  const body = await c.req.json();
  const result = await tools.getMeditation.execute!(
    {
      category: body.category || "stress_relief",
      durationMinutes: body.duration_minutes || 5,
      mood: body.mood,
      context: body.context,
      style: body.style,
      timeOfDay: body.time_of_day,
      persona: body.persona,
    },
    {} as any
  );
  return c.json(result);
});

// POST variant for generation with context
app.post("/api/v2/meditation/generate", async (c) => {
  const body = await c.req.json();
  const result = await tools.getMeditation.execute!(
    {
      category: body.category || "stress_relief",
      durationMinutes: body.duration_minutes || 5,
      mood: body.mood,
      context: body.context,
      style: body.style,
      timeOfDay: body.time_of_day,
      persona: body.persona,
    },
    {} as any
  );
  return c.json(result);
});

// List meditation styles/categories
app.get("/api/v2/meditation/styles", (c) => {
  const categories = [...new Set(meditationTemplates.map((m) => m.category))];
  const styles = [...new Set(meditationTemplates.map((m) => m.style))];
  return c.json({
    categories: categories.map((cat) => ({
      id: cat,
      templates: meditationTemplates.filter((m) => m.category === cat).map((m) => ({
        id: m.id,
        name: m.name,
        durationMinutes: m.durationMinutes,
        style: m.style,
      })),
    })),
    styles,
    totalTemplates: meditationTemplates.length,
  });
});

// --- Affirmation ---

app.get("/api/v2/affirmation", async (c) => {
  const category = c.req.query("category") as any;
  const mood = c.req.query("mood");
  const tradition = (c.req.query("tradition") as any) || "any";
  const userContext = c.req.query("user_context");
  const persona = c.req.query("persona") as any;
  const result = await tools.getAffirmation.execute!({ category, mood, tradition, userContext, persona }, {} as any);
  return c.json(result);
});

// Generate affirmation (POST variant)
app.post("/api/v2/affirmation/generate", async (c) => {
  const body = await c.req.json();
  const result = await tools.getAffirmation.execute!(
    {
      category: body.category,
      mood: body.mood,
      tradition: body.tradition || "any",
      userContext: body.user_context,
      persona: body.persona,
    },
    {} as any
  );
  return c.json(result);
});

// List affirmation categories
app.get("/api/v2/affirmation/categories", (c) => {
  const categories = [...new Set(affirmations.map((a) => a.category))];
  return c.json({
    categories: categories.map((cat) => ({
      id: cat,
      count: affirmations.filter((a) => a.category === cat).length,
      traditions: [...new Set(affirmations.filter((a) => a.category === cat).map((a) => a.tradition))],
    })),
    totalAffirmations: affirmations.length,
  });
});

// --- Check-in ---

app.post("/api/v2/mindfulness/check-in", async (c) => {
  const body = await c.req.json();
  const result = await tools.mindfulnessCheckIn.execute!(
    {
      mood: body.mood,
      energy: body.energy,
      context: body.context,
      timeAvailableMinutes: body.time_available_minutes,
    },
    {} as any
  );
  return c.json(result);
});

// Alternate path
app.post("/api/v2/check-in", async (c) => {
  const body = await c.req.json();
  const result = await tools.mindfulnessCheckIn.execute!(
    { mood: body.mood, energy: body.energy, context: body.context },
    {} as any
  );
  return c.json(result);
});

// =====================================================
// DECIDE LAYER (Layer 2)
// =====================================================

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

// List decisions for a user
app.get("/api/v2/decide/decisions/:user_id", async (c) => {
  const userId = c.req.param("user_id");
  const allDecisions = await getDecisionsByUser(userId);
  const decisions = allDecisions.map((d) => ({
    id: d.id,
    title: d.title,
    chosenOption: d.chosenOption,
    loggedAt: d.loggedAt,
    hasOutcome: d.outcome !== null,
    reviewDate: d.reviewDate,
  }));
  return c.json({ userId, decisions, total: decisions.length });
});

// Get single decision
app.get("/api/v2/decide/decision/:id", async (c) => {
  const id = c.req.param("id");
  const decision = await getDecisionById(id);
  if (!decision) return c.json({ error: "DECISION_NOT_FOUND", message: `No decision with id '${id}'` }, 404);
  return c.json({ decision });
});

// =====================================================
// REFLECT LAYER (Layer 3)
// =====================================================

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
  const focusArea = (c.req.query("focus_area") as any) || "all";
  const result = await tools.detectPatterns.execute!({ userId, focusArea }, {} as any);
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

// Reflection history for a user
app.get("/api/v2/reflect/history/:user_id", async (c) => {
  const userId = c.req.param("user_id");
  const allDecisions = await getDecisionsByUser(userId);
  const reflected = allDecisions
    .filter((d) => d.outcome !== null)
    .map((d) => ({
      decisionId: d.id,
      title: d.title,
      chosenOption: d.chosenOption,
      actualOutcome: d.outcome!.actualOutcome,
      satisfaction: d.outcome!.satisfaction,
      lessons: d.outcome!.lessons,
      wouldChooseDifferently: d.outcome!.wouldChooseDifferently,
      reflectedAt: d.outcome!.reflectedAt,
    }));
  return c.json({ userId, reflections: reflected, total: reflected.length });
});

// =====================================================
// REPUTATION LAYER (Layer 4)
// =====================================================

app.get("/api/v2/karma-score/:user_id", async (c) => {
  const userId = c.req.param("user_id");
  const includeBreakdown = c.req.query("breakdown") !== "false";
  const result = await tools.getKarmaScore.execute!({ userId, includeBreakdown }, {} as any);
  return c.json(result);
});

// =====================================================
// LEGACY GITA ENDPOINTS (from v1 compatibility)
// =====================================================

app.get("/api/v2/gita/chapters", (c) => {
  const chapters = new Map<number, { count: number; themes: Set<string> }>();
  for (const v of wisdomVerses.filter((v) => v.tradition === "gita")) {
    const match = v.reference.match(/Chapter (\d+)/);
    if (match) {
      const ch = parseInt(match[1]);
      if (!chapters.has(ch)) chapters.set(ch, { count: 0, themes: new Set() });
      const data = chapters.get(ch)!;
      data.count++;
      v.themes.forEach((t) => data.themes.add(t));
    }
  }
  return c.json({
    chapters: Array.from(chapters.entries())
      .sort(([a], [b]) => a - b)
      .map(([num, data]) => ({
        chapter: num,
        verseCount: data.count,
        themes: [...data.themes].slice(0, 5),
      })),
    totalChapters: chapters.size,
  });
});

app.get("/api/v2/gita/chapter/:number", (c) => {
  const chapterNum = c.req.param("number");
  const verses = wisdomVerses.filter(
    (v) => v.tradition === "gita" && v.reference.includes(`Chapter ${chapterNum}`)
  );
  if (verses.length === 0) return c.json({ error: "CHAPTER_NOT_FOUND", message: `No verses in chapter ${chapterNum}` }, 404);
  return c.json({
    chapter: parseInt(chapterNum),
    verses: verses.map((v) => ({
      id: v.id,
      reference: v.reference,
      text: v.text,
      interpretation: v.interpretation,
      themes: v.themes,
    })),
    total: verses.length,
  });
});

app.get("/api/v2/gita/verse/:chapter/:verse", (c) => {
  const chapter = c.req.param("chapter");
  const verse = c.req.param("verse");
  const ref = `${chapter}.${verse}`;
  const found = wisdomVerses.find(
    (v) => v.tradition === "gita" && (v.id.includes(ref) || v.reference.includes(ref))
  );
  if (!found) return c.json({ error: "VERSE_NOT_FOUND", message: `Gita verse ${chapter}.${verse} not found` }, 404);
  return c.json({
    verse: {
      id: found.id,
      reference: found.reference,
      text: found.text,
      interpretation: found.interpretation,
      themes: found.themes,
      moodTags: found.moodTags,
    },
  });
});

export { app };
