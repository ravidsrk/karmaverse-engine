import { describe, it, expect, beforeEach } from "vitest";
import { logOutcome } from "./log-outcome";
import { logDecision, getDecisionStore } from "../decide/log-decision";

const execOutcome = (params: any) => logOutcome.execute!(params, {} as any);
const execDecision = (params: any) => logDecision.execute!(params, {} as any);

describe("log_outcome", () => {
  beforeEach(() => {
    getDecisionStore().clear();
  });

  it("records outcome for existing decision", async () => {
    const decision = await execDecision({
      userId: "test",
      title: "Test decision",
      chosenOption: "A",
      predictedOutcome: "Good things",
      reviewAfterDays: 0,
    });
    const result = await execOutcome({
      decisionId: decision.decisionId,
      actualOutcome: "Great things happened",
      satisfaction: 8,
      lessons: "Trust the process",
      wouldChooseDifferently: false,
      surpriseFactor: "better_than_expected",
    });
    expect(result.recorded).toBe(true);
    expect(result.decisionTitle).toBe("Test decision");
    expect(result.predictionAccuracy).toContain("exceeded");
  });

  it("returns not found for invalid decision ID", async () => {
    const result = await execOutcome({
      decisionId: "dec_nonexistent",
      actualOutcome: "Something",
      satisfaction: 5,
      wouldChooseDifferently: false,
    });
    expect(result.recorded).toBe(false);
  });

  it("generates positive reflection for high satisfaction", async () => {
    const d = await execDecision({
      userId: "test",
      title: "Good decision",
      chosenOption: "A",
      reviewAfterDays: 0,
    });
    const result = await execOutcome({
      decisionId: d.decisionId,
      actualOutcome: "Excellent result",
      satisfaction: 9,
      wouldChooseDifferently: false,
    });
    expect(result.reflection).toContain("Great outcome");
  });

  it("generates empathetic reflection for low satisfaction", async () => {
    const d = await execDecision({
      userId: "test",
      title: "Tough decision",
      chosenOption: "B",
      reviewAfterDays: 0,
    });
    const result = await execOutcome({
      decisionId: d.decisionId,
      actualOutcome: "Didn't work out",
      satisfaction: 2,
      wouldChooseDifferently: true,
    });
    expect(result.reflection).toContain("Tough outcome");
    expect(result.reflection).toContain("choose differently");
  });

  it("handles different surprise factors", async () => {
    const d = await execDecision({
      userId: "test",
      title: "Surprise test",
      chosenOption: "X",
      predictedOutcome: "Something specific",
      reviewAfterDays: 0,
    });

    const asExpected = await execOutcome({
      decisionId: d.decisionId,
      actualOutcome: "As predicted",
      satisfaction: 7,
      wouldChooseDifferently: false,
      surpriseFactor: "as_expected",
    });
    expect(asExpected.predictionAccuracy).toContain("accurate");
  });

  it("includes karma score impact", async () => {
    const d = await execDecision({
      userId: "test",
      title: "Score test",
      chosenOption: "A",
      reviewAfterDays: 0,
    });
    const result = await execOutcome({
      decisionId: d.decisionId,
      actualOutcome: "OK",
      satisfaction: 5,
      wouldChooseDifferently: false,
    });
    expect(result.karmaScoreImpact).toContain("+");
  });
});
