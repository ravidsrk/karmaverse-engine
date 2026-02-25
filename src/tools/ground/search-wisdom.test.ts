import { describe, it, expect } from "vitest";
import { searchWisdom } from "./search-wisdom";

const exec = (params: any) => searchWisdom.execute!(params, {} as any);

describe("search_wisdom", () => {
  it("returns verses matching a query", async () => {
    const result = await exec({ query: "anxiety about decisions", tradition: "all", limit: 3 });
    expect(result.verses.length).toBeLessThanOrEqual(3);
    expect(result.verses.length).toBeGreaterThan(0);
    expect(result.totalAvailable).toBeGreaterThan(0);
  });

  it("respects limit parameter", async () => {
    const result = await exec({ query: "wisdom", tradition: "all", limit: 1 });
    expect(result.verses.length).toBe(1);
  });

  it("filters by tradition", async () => {
    const result = await exec({ query: "duty", tradition: "gita", limit: 10 });
    for (const v of result.verses) {
      expect(v.tradition).toBe("gita");
    }
  });

  it("matches by mood tag", async () => {
    const result = await exec({ query: "feeling low", mood: "sad", tradition: "all", limit: 3 });
    expect(result.verses.length).toBeGreaterThan(0);
    // At least one should have relevance reason mentioning mood
    const hasMoodMatch = result.verses.some((v) => v.relevanceReason.includes("mood"));
    expect(hasMoodMatch).toBe(true);
  });

  it("returns verse structure with all fields", async () => {
    const result = await exec({ query: "anxiety about control", mood: "anxious", tradition: "all", limit: 1 });
    const v = result.verses[0];
    expect(v.tradition).toBeTruthy();
    expect(v.source).toBeTruthy();
    expect(v.reference).toBeTruthy();
    expect(v.text).toBeTruthy();
    expect(v.interpretation).toBeTruthy();
    expect(v.themes).toBeInstanceOf(Array);
    expect(v.relevanceReason).toBeTruthy();
  });

  it("returns results for all traditions when 'all' is selected", async () => {
    const result = await exec({ query: "life wisdom", tradition: "all", limit: 10 });
    const traditions = new Set(result.verses.map((v) => v.tradition));
    expect(traditions.size).toBeGreaterThan(1);
  });
});
