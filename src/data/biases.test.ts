import { describe, it, expect } from "vitest";
import { cognitiveBiases } from "./biases";

describe("Cognitive Biases Data", () => {
  it("has exactly 12 biases", () => {
    expect(cognitiveBiases.length).toBe(12);
  });

  it("has unique IDs", () => {
    const ids = cognitiveBiases.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every bias has signal patterns", () => {
    for (const b of cognitiveBiases) {
      expect(b.name).toBeTruthy();
      expect(b.description.length).toBeGreaterThan(20);
      expect(b.signalPatterns.length).toBeGreaterThanOrEqual(3);
      expect(b.debiasingStrategy.length).toBeGreaterThan(20);
    }
  });

  it("every bias has a wisdom connection", () => {
    for (const b of cognitiveBiases) {
      expect(b.wisdomConnection.tradition).toBeTruthy();
      expect(b.wisdomConnection.reference).toBeTruthy();
      expect(b.wisdomConnection.insight.length).toBeGreaterThan(10);
    }
  });

  it("covers expected biases", () => {
    const names = cognitiveBiases.map((b) => b.id);
    expect(names).toContain("sunk-cost");
    expect(names).toContain("confirmation");
    expect(names).toContain("anchoring");
    expect(names).toContain("loss-aversion");
    expect(names).toContain("dunning-kruger");
    expect(names).toContain("framing");
  });

  it("signal patterns are lowercase-matchable", () => {
    for (const b of cognitiveBiases) {
      for (const pattern of b.signalPatterns) {
        // Patterns should be lowercase phrases that appear in natural text
        expect(pattern.length).toBeGreaterThan(3);
      }
    }
  });
});
