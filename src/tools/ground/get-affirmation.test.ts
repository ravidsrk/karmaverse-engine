import { describe, it, expect } from "vitest";
import { getAffirmation } from "./get-affirmation";

const exec = (params: any) => getAffirmation.execute!(params, {} as any);

describe("get_affirmation", () => {
  it("returns affirmation by category", async () => {
    const result = await exec({ category: "calm", tradition: "any" });
    expect(result.affirmation.text).toBeTruthy();
    expect(result.affirmation.category).toBe("calm");
  });

  it("returns affirmation by mood", async () => {
    const result = await exec({ mood: "anxious", tradition: "any" });
    expect(result.affirmation.text).toBeTruthy();
  });

  it("filters by tradition", async () => {
    const result = await exec({ tradition: "stoic" });
    expect(result.affirmation.tradition).toBe("stoic");
  });

  it("includes a suggestion", async () => {
    const result = await exec({ category: "resilience", tradition: "any" });
    expect(result.suggestion).toBeTruthy();
    expect(result.suggestion.length).toBeGreaterThan(10);
  });

  it("returns affirmation even with no filters", async () => {
    const result = await exec({ tradition: "any" });
    expect(result.affirmation.text).toBeTruthy();
    expect(result.affirmation.category).toBeTruthy();
  });
});
