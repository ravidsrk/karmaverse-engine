import { describe, it, expect } from "vitest";
import { createDecisionFramework } from "./create-decision-framework";

const exec = (params: any) => createDecisionFramework.execute!(params, {} as any);

describe("create_decision_framework", () => {
  it("returns full framework for a decision", async () => {
    const result = await exec({
      decision: "Should I quit my job?",
      options: ["Quit", "Stay"],
      urgency: "weeks",
    });
    expect(result.decision).toBe("Should I quit my job?");
    expect(result.framework.valuesAlignment).toBeTruthy();
    expect(result.framework.fearVsGrowth).toBeTruthy();
    expect(result.framework.regretMinimization).toBeTruthy();
    expect(result.framework.reversibility).toBeTruthy();
    expect(result.recommendation).toBeTruthy();
    expect(result.nextStep).toBeTruthy();
  });

  it("detects sunk cost bias in context", async () => {
    const result = await exec({
      decision: "Should I continue this project?",
      options: ["Continue", "Stop"],
      context: "I've already invested 2 years and a lot of money",
      urgency: "weeks",
    });
    const biasNames = result.biasesDetected.map((b: any) => b.bias);
    expect(biasNames).toContain("Sunk Cost Fallacy");
  });

  it("detects recency bias for immediate urgent decisions", async () => {
    const result = await exec({
      decision: "Should I quit?",
      options: ["Quit", "Stay"],
      context: "I just had a terrible meeting",
      urgency: "immediate",
    });
    const biasNames = result.biasesDetected.map((b: any) => b.bias);
    expect(biasNames).toContain("Recency Bias");
  });

  it("identifies fear vs growth options", async () => {
    const result = await exec({
      decision: "Career change?",
      options: ["Stay at safe job", "Start new venture"],
      urgency: "months",
    });
    expect(result.framework.fearVsGrowth.fearOption).toBeTruthy();
    expect(result.framework.fearVsGrowth.growthOption).toBeTruthy();
  });

  it("provides wisdom counsel", async () => {
    const result = await exec({
      decision: "Big life choice",
      options: ["A", "B"],
      urgency: "weeks",
    });
    expect(result.wisdomCounsel.length).toBeGreaterThan(0);
    for (const counsel of result.wisdomCounsel) {
      expect(counsel.tradition).toBeTruthy();
      expect(counsel.insight).toBeTruthy();
    }
  });

  it("uses user values in analysis", async () => {
    const result = await exec({
      decision: "Move cities?",
      options: ["Stay", "Move"],
      userValues: ["family", "career", "health"],
      urgency: "weeks",
    });
    expect(result.framework.valuesAlignment.analysis).toContain("family");
    expect(result.framework.valuesAlignment.analysis).toContain("career");
  });

  it("warns about immediate decisions", async () => {
    const result = await exec({
      decision: "React to something",
      options: ["Act now", "Wait"],
      urgency: "immediate",
    });
    expect(result.recommendation).toContain("sleep");
  });
});
