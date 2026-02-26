import { describe, it, expect, beforeEach } from "vitest";
import { getKarmaScore, computeKarmaScore, getKarmaLevel, KARMA_LEVELS } from "./get-karma-score";
import { getDecisionStore } from "../decide/log-decision";

describe("get_karma_score", () => {
  beforeEach(() => {
    const store = getDecisionStore();
    store.clear();
  });

  it("returns a score for a user with no data", async () => {
    const result = await getKarmaScore.execute({ userId: "new_user", includeBreakdown: true });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.level).toBeDefined();
    expect(result.suggestion).toBeDefined();
  });

  it("includes breakdown when requested", async () => {
    const result = await getKarmaScore.execute({ userId: "test", includeBreakdown: true });
    expect(result.breakdown).toBeDefined();
    expect(result.breakdown?.grounding).toBeGreaterThanOrEqual(0);
    expect(result.breakdown?.decisionQuality).toBeGreaterThanOrEqual(0);
    expect(result.breakdown?.reflectionDiscipline).toBeGreaterThanOrEqual(0);
    expect(result.breakdown?.patternAwareness).toBeGreaterThanOrEqual(0);
    expect(result.breakdown?.valueAlignment).toBeGreaterThanOrEqual(0);
  });

  it("provides next milestone unless at Mastery", async () => {
    const result = await getKarmaScore.execute({ userId: "test", includeBreakdown: true });
    // Default score is low enough that a next milestone should exist
    if (result.score < 81) {
      expect(result.nextMilestone).not.toBeNull();
      expect(result.nextMilestone!.pointsNeeded).toBeGreaterThan(0);
    }
  });

  it("uses correct spec thresholds for levels", () => {
    expect(getKarmaLevel(0).label).toBe("Beginning");
    expect(getKarmaLevel(15).label).toBe("Beginning");
    expect(getKarmaLevel(20).label).toBe("Beginning");
    expect(getKarmaLevel(21).label).toBe("Awakening");
    expect(getKarmaLevel(40).label).toBe("Awakening");
    expect(getKarmaLevel(41).label).toBe("Growing");
    expect(getKarmaLevel(60).label).toBe("Growing");
    expect(getKarmaLevel(61).label).toBe("Flourishing");
    expect(getKarmaLevel(80).label).toBe("Flourishing");
    expect(getKarmaLevel(81).label).toBe("Mastery");
    expect(getKarmaLevel(100).label).toBe("Mastery");
  });

  it("has 5 levels matching spec", () => {
    expect(KARMA_LEVELS).toHaveLength(5);
    expect(KARMA_LEVELS.map((l) => l.label)).toEqual([
      "Beginning", "Awakening", "Growing", "Flourishing", "Mastery",
    ]);
  });

  it("computes higher score with decisions and outcomes", () => {
    const store = getDecisionStore();
    // Add some decisions with outcomes
    store.set("d1", {
      id: "d1",
      userId: "active_user",
      title: "Test decision",
      options: ["A", "B"],
      chosenOption: "A",
      reasoning: "Test",
      biasesFlagged: ["confirmation_bias"],
      loggedAt: new Date().toISOString(),
      reviewDate: null,
      outcome: { actualOutcome: "Good", satisfaction: 8, lessons: "Learned", wouldChooseDifferently: false, reflectedAt: new Date().toISOString() },
    });
    store.set("d2", {
      id: "d2",
      userId: "active_user",
      title: "Test decision 2",
      options: ["X", "Y"],
      chosenOption: "X",
      reasoning: "Test 2",
      biasesFlagged: ["anchoring_bias"],
      loggedAt: new Date().toISOString(),
      reviewDate: null,
      outcome: { actualOutcome: "Great", satisfaction: 9, lessons: "Valuable", wouldChooseDifferently: false, reflectedAt: new Date().toISOString() },
    });

    const active = computeKarmaScore("active_user");
    const empty = computeKarmaScore("empty_user");

    expect(active.score).toBeGreaterThan(empty.score);
    expect(active.stats.totalDecisions).toBe(2);
    expect(active.stats.totalReflections).toBe(2);
    expect(active.stats.biasesIdentified).toContain("confirmation_bias");
  });
});
