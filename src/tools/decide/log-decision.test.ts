import { describe, it, expect, beforeEach } from "vitest";
import { logDecision } from "./log-decision";
import { getDecisionById, getDecisionsByUser, getMemoryStore } from "../../db";
import { disconnectDb } from "../../db";

const exec = (params: any) => logDecision.execute!(params, {} as any);

describe("log_decision", () => {
  beforeEach(() => {
    // Clear in-memory store for tests (Prisma data is ephemeral per test if no DB)
    getMemoryStore().clear();
  });

  it("logs a decision and returns ID", async () => {
    const result = await exec({
      userId: "test-user",
      title: "Test decision",
      chosenOption: "Option A",
      reviewAfterDays: 30,
    });
    expect(result.decisionId).toMatch(/^dec_/);
    expect(result.title).toBe("Test decision");
    expect(result.loggedAt).toBeTruthy();
    expect(result.reviewDate).toBeTruthy();
    expect(result.message).toContain("30 days");
  });

  it("stores decision and retrieves it", async () => {
    const result = await exec({
      userId: "test-user",
      title: "Stored decision",
      chosenOption: "Option B",
      reviewAfterDays: 7,
    });
    const stored = await getDecisionById(result.decisionId);
    expect(stored).not.toBeNull();
    expect(stored!.title).toBe("Stored decision");
    expect(stored!.chosenOption).toBe("Option B");
  });

  it("stores optional fields", async () => {
    const result = await exec({
      userId: "test-user-opt",
      title: "Detailed decision",
      chosenOption: "Option C",
      reasoning: "Because of X, Y, Z",
      predictedOutcome: "Good things will happen",
      confidenceLevel: 8,
      biasesFlagged: ["Sunk Cost"],
      reviewAfterDays: 14,
    });
    const d = await getDecisionById(result.decisionId);
    expect(d).not.toBeNull();
    expect(d!.reasoning).toBe("Because of X, Y, Z");
    expect(d!.predictedOutcome).toBe("Good things will happen");
    expect(d!.confidenceLevel).toBe(8);
    expect(d!.biasesFlagged).toContain("Sunk Cost");
  });

  it("calculates review date correctly", async () => {
    const result = await exec({
      userId: "test-user",
      title: "Review date test",
      chosenOption: "Option A",
      reviewAfterDays: 0,
    });
    const today = new Date().toISOString().split("T")[0];
    expect(result.reviewDate).toBe(today);
  });

  it("generates unique IDs", async () => {
    const r1 = await exec({ userId: "u1", title: "D1", chosenOption: "A", reviewAfterDays: 30 });
    const r2 = await exec({ userId: "u1", title: "D2", chosenOption: "B", reviewAfterDays: 30 });
    expect(r1.decisionId).not.toBe(r2.decisionId);
  });
});
