import { describe, it, expect, beforeEach } from "vitest";
import { generateReflection } from "./generate-reflection";
import { logDecision, getDecisionStore } from "../decide/log-decision";
import { logOutcome } from "./log-outcome";

const execReflection = (params: any) => generateReflection.execute!(params, {} as any);
const execDecision = (params: any) => logDecision.execute!(params, {} as any);
const execOutcome = (params: any) => logOutcome.execute!(params, {} as any);

describe("generate_reflection", () => {
  beforeEach(() => {
    getDecisionStore().clear();
  });

  it("generates weekly reflection with no data", async () => {
    const result = await execReflection({ userId: "empty-user", period: "weekly" });
    expect(result.period).toContain("weekly");
    expect(result.summary.decisionsLogged).toBe(0);
    expect(result.karmaScoreEstimate.score).toBeGreaterThanOrEqual(0);
    expect(result.karmaScoreEstimate.level).toBeTruthy();
  });

  it("generates reflection with decisions and outcomes", async () => {
    const d = await execDecision({
      userId: "reflector",
      title: "Reflection test",
      chosenOption: "A",
      confidenceLevel: 7,
      reviewAfterDays: 0,
    });
    await execOutcome({
      decisionId: d.decisionId,
      actualOutcome: "Good",
      satisfaction: 8,
      wouldChooseDifferently: false,
    });
    const result = await execReflection({ userId: "reflector", period: "weekly" });
    expect(result.summary.decisionsLogged).toBe(1);
    expect(result.summary.outcomesRecorded).toBe(1);
    expect(result.summary.avgSatisfaction).toBe(8);
  });

  it("includes wisdom for next period", async () => {
    const result = await execReflection({ userId: "anyone", period: "monthly" });
    expect(result.wisdomForNextPeriod.tradition).toBeTruthy();
    expect(result.wisdomForNextPeriod.text).toBeTruthy();
    expect(result.wisdomForNextPeriod.whyThisOne).toContain("month");
  });

  it("calculates karma score", async () => {
    const result = await execReflection({ userId: "scorer", period: "weekly" });
    expect(result.karmaScoreEstimate.score).toBeGreaterThanOrEqual(0);
    expect(result.karmaScoreEstimate.score).toBeLessThanOrEqual(100);
    expect(["Beginning", "Awakening", "Growing", "Flourishing", "Mastery"]).toContain(
      result.karmaScoreEstimate.level
    );
  });

  it("generates highlights and growth areas", async () => {
    const d = await execDecision({
      userId: "grower",
      title: "Growth test",
      chosenOption: "B",
      biasesFlagged: ["Confirmation Bias"],
      reviewAfterDays: 0,
    });
    await execOutcome({
      decisionId: d.decisionId,
      actualOutcome: "OK",
      satisfaction: 6,
      wouldChooseDifferently: false,
    });
    const result = await execReflection({ userId: "grower", period: "weekly" });
    expect(result.highlights.length).toBeGreaterThan(0);
    expect(result.growthAreas.length).toBeGreaterThan(0);
  });

  it("supports different periods", async () => {
    const weekly = await execReflection({ userId: "test", period: "weekly" });
    const monthly = await execReflection({ userId: "test", period: "monthly" });
    const quarterly = await execReflection({ userId: "test", period: "quarterly" });
    expect(weekly.period).toContain("weekly");
    expect(monthly.period).toContain("monthly");
    expect(quarterly.period).toContain("quarterly");
  });
});
