import { describe, it, expect } from "vitest";
import { getVerse } from "./get-verse";

const exec = (params: any) => getVerse.execute!(params, {} as any);

describe("get_verse", () => {
  it("finds verse by tradition and reference", async () => {
    const result = await exec({ tradition: "gita", reference: "2, Verse 47" });
    expect(result.found).toBe(true);
    expect(result.verse).not.toBeNull();
    expect(result.verse!.tradition).toBe("gita");
    expect(result.verse!.reference).toContain("47");
  });

  it("finds verse by direct ID", async () => {
    const result = await exec({ tradition: "gita", id: "gita-2-47" });
    expect(result.found).toBe(true);
    expect(result.verse!.id).toBe("gita-2-47");
  });

  it("returns random verse from tradition when no reference given", async () => {
    const result = await exec({ tradition: "stoic" });
    expect(result.found).toBe(true);
    expect(result.verse!.tradition).toBe("stoic");
  });

  it("returns null for non-existent reference", async () => {
    const result = await exec({ tradition: "gita", reference: "999.999" });
    expect(result.found).toBe(false);
    expect(result.verse).toBeNull();
  });

  it("returns full verse structure", async () => {
    const result = await exec({ tradition: "buddhist" });
    expect(result.verse).not.toBeNull();
    expect(result.verse!.text.length).toBeGreaterThan(10);
    expect(result.verse!.interpretation.length).toBeGreaterThan(10);
    expect(result.verse!.themes.length).toBeGreaterThan(0);
    expect(result.verse!.moodTags.length).toBeGreaterThan(0);
  });
});
