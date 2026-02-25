import { describe, it, expect } from "vitest";
import { verseOfTheDay } from "./verse-of-the-day";

const exec = (params: any) => verseOfTheDay.execute!(params, {} as any);

describe("verse_of_the_day", () => {
  it("returns a verse with today's date", async () => {
    const result = await exec({ tradition: "any" });
    expect(result.verse.text).toBeTruthy();
    expect(result.date).toBe(new Date().toISOString().split("T")[0]);
  });

  it("returns deterministic verse for same day", async () => {
    const r1 = await exec({ tradition: "any" });
    const r2 = await exec({ tradition: "any" });
    expect(r1.verse.reference).toBe(r2.verse.reference);
  });

  it("filters by tradition", async () => {
    const result = await exec({ tradition: "gita" });
    expect(result.verse.tradition).toBe("gita");
  });

  it("includes day message", async () => {
    const result = await exec({ tradition: "any" });
    expect(result.dayMessage).toBeTruthy();
    expect(result.dayMessage.length).toBeGreaterThan(10);
  });

  it("verse has full structure", async () => {
    const result = await exec({ tradition: "any" });
    expect(result.verse.tradition).toBeTruthy();
    expect(result.verse.source).toBeTruthy();
    expect(result.verse.reference).toBeTruthy();
    expect(result.verse.interpretation).toBeTruthy();
    expect(result.verse.themes.length).toBeGreaterThan(0);
  });
});
