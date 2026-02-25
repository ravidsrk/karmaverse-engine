import { describe, it, expect, beforeEach } from "vitest";
import { getPendingReflections } from "./get-pending-reflections";
import { logDecision, getDecisionStore } from "../decide/log-decision";
import { logOutcome } from "./log-outcome";

const execPending = (params: any) => getPendingReflections.execute!(params, {} as any);
const execDecision = (params: any) => logDecision.execute!(params, {} as any);
const execOutcome = (params: any) => logOutcome.execute!(params, {} as any);

describe("get_pending_reflections", () => {
  beforeEach(() => {
    getDecisionStore().clear();
  });

  it("returns empty when no decisions", async () => {
    const result = await execPending({ userId: "nobody" });
    expect(result.pending.length).toBe(0);
    expect(result.totalPending).toBe(0);
    expect(result.message).toContain("No pending");
  });

  it("finds decisions due for review", async () => {
    await execDecision({
      userId: "reviewer",
      title: "Due for review",
      chosenOption: "A",
      reviewAfterDays: 0, // Due today
    });
    const result = await execPending({ userId: "reviewer" });
    expect(result.totalPending).toBe(1);
    expect(result.pending[0].title).toBe("Due for review");
    expect(result.pending[0].prompt).toContain("Due for review");
  });

  it("excludes already-reflected decisions", async () => {
    const d = await execDecision({
      userId: "done",
      title: "Already reflected",
      chosenOption: "A",
      reviewAfterDays: 0,
    });
    await execOutcome({
      decisionId: d.decisionId,
      actualOutcome: "Done",
      satisfaction: 7,
      wouldChooseDifferently: false,
    });
    const result = await execPending({ userId: "done" });
    expect(result.totalPending).toBe(0);
  });

  it("excludes decisions not yet due", async () => {
    await execDecision({
      userId: "future",
      title: "Not due yet",
      chosenOption: "A",
      reviewAfterDays: 365, // Due in a year
    });
    const result = await execPending({ userId: "future" });
    expect(result.totalPending).toBe(0);
    expect(result.message).toContain("soon");
  });

  it("calculates days overdue", async () => {
    await execDecision({
      userId: "overdue",
      title: "Overdue decision",
      chosenOption: "A",
      reviewAfterDays: 0,
    });
    const result = await execPending({ userId: "overdue" });
    expect(result.pending[0].daysOverdue).toBeGreaterThanOrEqual(0);
  });

  it("includes predicted outcome in pending items", async () => {
    await execDecision({
      userId: "predictor",
      title: "Predicted",
      chosenOption: "B",
      predictedOutcome: "Great things will happen",
      reviewAfterDays: 0,
    });
    const result = await execPending({ userId: "predictor" });
    expect(result.pending[0].predictedOutcome).toBe("Great things will happen");
  });

  it("isolates by user", async () => {
    await execDecision({ userId: "alice", title: "Alice's decision", chosenOption: "A", reviewAfterDays: 0 });
    await execDecision({ userId: "bob", title: "Bob's decision", chosenOption: "B", reviewAfterDays: 0 });
    const aliceResult = await execPending({ userId: "alice" });
    const bobResult = await execPending({ userId: "bob" });
    expect(aliceResult.totalPending).toBe(1);
    expect(bobResult.totalPending).toBe(1);
    expect(aliceResult.pending[0].title).toBe("Alice's decision");
  });
});
