import { describe, it, expect } from "vitest";
import { getWisdomCounsel } from "./get-wisdom-counsel";

const exec = (params: any) => getWisdomCounsel.execute!(params, {} as any);

describe("get_wisdom_counsel", () => {
  it("returns counsel from multiple traditions", async () => {
    const result = await exec({
      dilemma: "duty vs personal happiness",
      traditions: ["gita", "stoic", "buddhist"],
      depth: "brief",
    });
    expect(result.counsel.length).toBe(3);
    expect(result.dilemma).toBe("duty vs personal happiness");
  });

  it("provides synthesis across traditions", async () => {
    const result = await exec({
      dilemma: "handling uncertainty",
      traditions: ["gita", "stoic"],
      depth: "brief",
    });
    expect(result.synthesis).toBeTruthy();
    expect(result.synthesis.length).toBeGreaterThan(20);
  });

  it("each counsel entry has full structure", async () => {
    const result = await exec({
      dilemma: "fear of change",
      traditions: ["gita"],
      depth: "detailed",
    });
    const c = result.counsel[0];
    expect(c.tradition).toBeTruthy();
    expect(c.source).toBeTruthy();
    expect(c.reference).toBeTruthy();
    expect(c.text).toBeTruthy();
    expect(c.interpretation).toBeTruthy();
    expect(c.applicationToYou).toContain("fear of change");
  });

  it("detailed depth returns longer interpretations", async () => {
    const brief = await exec({ dilemma: "test", traditions: ["stoic"], depth: "brief" });
    const detailed = await exec({ dilemma: "test", traditions: ["stoic"], depth: "detailed" });
    expect(detailed.counsel[0].interpretation.length).toBeGreaterThanOrEqual(
      brief.counsel[0].interpretation.length
    );
  });

  it("handles single tradition", async () => {
    const result = await exec({
      dilemma: "single tradition test",
      traditions: ["yoga_sutras"],
      depth: "brief",
    });
    expect(result.counsel.length).toBe(1);
    expect(result.counsel[0].tradition).toBe("Yoga Sutras");
  });
});
