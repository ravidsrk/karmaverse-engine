import { describe, it, expect } from "vitest";
import { detectBiases } from "./detect-biases";

const exec = (params: any) => detectBiases.execute!(params, {} as any);

describe("detect_biases", () => {
  it("detects sunk cost fallacy", async () => {
    const result = await exec({
      reasoning: "I've already invested so much time, I can't stop now",
    });
    expect(result.biasesFound.length).toBeGreaterThan(0);
    expect(result.biasesFound[0].name).toBe("Sunk Cost Fallacy");
  });

  it("detects confirmation bias", async () => {
    const result = await exec({
      reasoning: "Everyone I asked agrees with me, all the research I've seen supports it",
    });
    const names = result.biasesFound.map((b) => b.name);
    expect(names).toContain("Confirmation Bias");
  });

  it("detects bandwagon effect", async () => {
    const result = await exec({
      reasoning: "Everyone else is doing it, I don't want to miss out",
    });
    const names = result.biasesFound.map((b) => b.name);
    expect(names).toContain("Bandwagon Effect");
  });

  it("detects multiple biases simultaneously", async () => {
    const result = await exec({
      reasoning: "I've already invested years. Everyone I asked agrees this is the right path. How hard can it be?",
    });
    expect(result.biasesFound.length).toBeGreaterThanOrEqual(2);
  });

  it("returns 'clear' for unbiased reasoning", async () => {
    const result = await exec({
      reasoning: "After weighing both options with fresh perspective and consulting two people who disagree with me, I've reached a conclusion.",
    });
    expect(result.reasoningQuality).toBe("clear");
    expect(result.biasesFound.length).toBe(0);
  });

  it("marks heavily biased reasoning", async () => {
    const result = await exec({
      reasoning: "I've already invested too much. Everyone else is doing it too. I just saw a story about success. It should only take a week. I knew it all along.",
    });
    expect(result.reasoningQuality).toBe("heavily_biased");
    expect(result.biasesFound.length).toBeGreaterThanOrEqual(3);
  });

  it("provides de-biasing strategies", async () => {
    const result = await exec({
      reasoning: "I've already invested years in this",
    });
    expect(result.biasesFound[0].debiasingStrategy.length).toBeGreaterThan(20);
  });

  it("provides wisdom connections for each bias", async () => {
    const result = await exec({
      reasoning: "I can't quit now after investing so much",
    });
    expect(result.biasesFound[0].wisdomConnection.tradition).toBeTruthy();
    expect(result.biasesFound[0].wisdomConnection.insight).toBeTruthy();
  });

  it("assigns severity levels", async () => {
    const result = await exec({
      reasoning: "I've already invested years. I've put so much into this. I can't quit now after all this effort.",
    });
    const sunkCost = result.biasesFound.find((b) => b.name === "Sunk Cost Fallacy");
    expect(sunkCost).toBeTruthy();
    // Multiple signal matches should increase severity
    expect(["medium", "high"]).toContain(sunkCost!.severity);
  });
});
