import { describe, it, expect, beforeEach } from "vitest";
import { app } from "./server";
import { getDecisionStore } from "../tools/decide/log-decision";

const request = (path: string, init?: RequestInit) =>
  app.request(path, init);

describe("REST API", () => {
  beforeEach(() => {
    getDecisionStore().clear();
  });

  describe("GET /", () => {
    it("returns health check with API info", async () => {
      const res = await request("/");
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.name).toContain("KarmaVerse");
      expect(data.tools).toBe(16);
      expect(data.layers).toContain("ground");
      expect(data.layers).toContain("decide");
      expect(data.layers).toContain("reflect");
    });
  });

  // === GROUND LAYER ===

  describe("GET /api/v2/verse-of-day", () => {
    it("returns verse of the day", async () => {
      const res = await request("/api/v2/verse-of-day");
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.verse.text).toBeTruthy();
      expect(data.date).toBeTruthy();
      expect(data.dayMessage).toBeTruthy();
    });

    it("filters by tradition", async () => {
      const res = await request("/api/v2/verse-of-day?tradition=gita");
      const data = await res.json();
      expect(data.verse.tradition).toBe("gita");
    });
  });

  describe("GET /api/v2/wisdom/search", () => {
    it("searches wisdom by query", async () => {
      const res = await request("/api/v2/wisdom/search?q=anxiety&limit=2");
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.verses.length).toBeLessThanOrEqual(2);
      expect(data.totalAvailable).toBeGreaterThan(0);
    });

    it("filters by mood and tradition", async () => {
      const res = await request("/api/v2/wisdom/search?q=test&mood=sad&tradition=stoic&limit=3");
      const data = await res.json();
      for (const v of data.verses) {
        expect(v.tradition).toBe("stoic");
      }
    });
  });

  describe("GET /api/v2/verse", () => {
    it("gets verse by tradition and reference", async () => {
      const res = await request("/api/v2/verse?tradition=gita&reference=2%2C+Verse+47");
      const data = await res.json();
      expect(data.found).toBe(true);
      expect(data.verse.tradition).toBe("gita");
    });

    it("returns 400 without tradition or id", async () => {
      const res = await request("/api/v2/verse");
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v2/breathing", () => {
    it("returns breathing exercise by use case", async () => {
      const res = await request("/api/v2/breathing?use_case=anxiety");
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.exercise.name).toBeTruthy();
      expect(data.exercise.steps.length).toBeGreaterThan(0);
    });

    it("returns exercise by slug", async () => {
      const res = await request("/api/v2/breathing?slug=box-breathing");
      const data = await res.json();
      expect(data.exercise.name).toBe("Box Breathing");
    });
  });

  describe("GET /api/v2/affirmation", () => {
    it("returns affirmation", async () => {
      const res = await request("/api/v2/affirmation?category=calm");
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.affirmation.text).toBeTruthy();
      expect(data.suggestion).toBeTruthy();
    });
  });

  describe("POST /api/v2/mindfulness/check-in", () => {
    it("returns complete grounding session", async () => {
      const res = await request("/api/v2/mindfulness/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: "anxious", energy: "high", context: "test" }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.assessment).toBeTruthy();
      expect(data.breathing.name).toBeTruthy();
      expect(data.wisdom.text).toBeTruthy();
      expect(data.grounding.affirmation).toBeTruthy();
    });
  });

  // === DECIDE LAYER ===

  describe("POST /api/v2/decide/framework", () => {
    it("returns decision framework", async () => {
      const res = await request("/api/v2/decide/framework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision: "Test decision",
          options: ["A", "B"],
        }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.decision).toBe("Test decision");
      expect(data.framework).toBeTruthy();
      expect(data.recommendation).toBeTruthy();
    });
  });

  describe("POST /api/v2/decide/biases", () => {
    it("detects biases in reasoning", async () => {
      const res = await request("/api/v2/decide/biases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reasoning: "I've already invested too much to stop now",
        }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.biasesFound.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/v2/decide/log", () => {
    it("logs decision and returns ID", async () => {
      const res = await request("/api/v2/decide/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "API test decision",
          chosen_option: "A",
        }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.decisionId).toMatch(/^dec_/);
    });
  });

  describe("POST /api/v2/decide/counsel", () => {
    it("returns cross-tradition counsel", async () => {
      const res = await request("/api/v2/decide/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dilemma: "career vs family" }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.counsel.length).toBeGreaterThan(0);
      expect(data.synthesis).toBeTruthy();
    });
  });

  // === REFLECT LAYER ===

  describe("GET /api/v2/reflect/pending", () => {
    it("returns pending reflections", async () => {
      const res = await request("/api/v2/reflect/pending?user_id=test");
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.totalPending).toBeGreaterThanOrEqual(0);
    });
  });

  describe("GET /api/v2/reflect/patterns", () => {
    it("returns pattern analysis", async () => {
      const res = await request("/api/v2/reflect/patterns?user_id=test");
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(typeof data.insufficientData).toBe("boolean");
    });
  });

  describe("GET /api/v2/reflect/report", () => {
    it("generates reflection report", async () => {
      const res = await request("/api/v2/reflect/report?user_id=test&period=weekly");
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.period).toContain("weekly");
      expect(data.karmaScoreEstimate).toBeTruthy();
    });
  });

  describe("POST /api/v2/reflect/outcome", () => {
    it("records outcome for decision", async () => {
      // First log a decision
      const decRes = await request("/api/v2/decide/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "api-test",
          title: "Outcome test",
          chosen_option: "A",
          review_after_days: 0,
        }),
      });
      const dec = await decRes.json();

      // Then log outcome
      const res = await request("/api/v2/reflect/outcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_id: dec.decisionId,
          actual_outcome: "It worked",
          satisfaction: 8,
        }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.recorded).toBe(true);
    });
  });
});
