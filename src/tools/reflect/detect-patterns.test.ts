import { describe, it, expect, beforeEach } from "vitest";
import { detectPatterns } from "./detect-patterns";
import { logDecision, getDecisionStore } from "../decide/log-decision";
import { logOutcome } from "./log-outcome";

const execPatterns = (params: any) => detectPatterns.execute!(params, {} as any);
const execDecision = (params: any) => logDecision.execute!(params, {} as any);
const execOutcome = (params: any) => logOutcome.execute!(params, {} as any);

async function logDecisionWithOutcome(userId: string, title: string, confidence: number, satisfaction: number, regret: boolean = false) {
  const d = await execDecision({
    userId,
    title,
    chosenOption: "Option",
    confidenceLevel: confidence,
    reviewAfterDays: 0,
  });
  await execOutcome({
    decisionId: d.decisionId,
    actualOutcome: "Outcome",
    satisfaction,
    wouldChooseDifferently: regret,
  });
  return d;
}

describe("detect_patterns", () => {
  beforeEach(() => {
    getDecisionStore().clear();
  });

  it("returns insufficient data for < 3 decisions", async () => {
    await logDecisionWithOutcome("user1", "D1", 5, 5);
    await logDecisionWithOutcome("user1", "D2", 5, 5);
    const result = await execPatterns({ userId: "user1" });
    expect(result.insufficientData).toBe(true);
    expect(result.totalWithOutcomes).toBe(2);
  });

  it("detects patterns with 3+ reflected decisions", async () => {
    await logDecisionWithOutcome("user2", "D1", 9, 8);
    await logDecisionWithOutcome("user2", "D2", 9, 9);
    await logDecisionWithOutcome("user2", "D3", 2, 3);
    const result = await execPatterns({ userId: "user2" });
    expect(result.insufficientData).toBe(false);
    expect(result.totalWithOutcomes).toBe(3);
  });

  it("detects confidence calibration pattern", async () => {
    await logDecisionWithOutcome("user3", "D1", 9, 9);
    await logDecisionWithOutcome("user3", "D2", 8, 8);
    await logDecisionWithOutcome("user3", "D3", 2, 3);
    const result = await execPatterns({ userId: "user3" });
    const confPattern = result.patternsFound.find((p) => p.type === "confidence_calibration");
    expect(confPattern).toBeTruthy();
  });

  it("detects regret rate pattern", async () => {
    await logDecisionWithOutcome("user4", "D1", 5, 3, true);
    await logDecisionWithOutcome("user4", "D2", 5, 4, true);
    await logDecisionWithOutcome("user4", "D3", 5, 7, false);
    const result = await execPatterns({ userId: "user4" });
    const regretPattern = result.patternsFound.find((p) => p.type === "regret_rate");
    expect(regretPattern).toBeTruthy();
  });

  it("isolates users - no cross-contamination", async () => {
    await logDecisionWithOutcome("alice", "D1", 5, 8);
    await logDecisionWithOutcome("alice", "D2", 5, 8);
    await logDecisionWithOutcome("alice", "D3", 5, 8);
    await logDecisionWithOutcome("bob", "D1", 5, 5);
    const bobResult = await execPatterns({ userId: "bob" });
    expect(bobResult.insufficientData).toBe(true);
    expect(bobResult.totalWithOutcomes).toBe(1);
  });

  it("returns helpful message for insufficient data", async () => {
    const result = await execPatterns({ userId: "nobody" });
    expect(result.insufficientData).toBe(true);
    expect(result.message).toContain("Need at least 3");
  });
});
