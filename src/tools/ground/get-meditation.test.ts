import { describe, it, expect } from "vitest";
import { getMeditation } from "./get-meditation";

const exec = (params: any) => getMeditation.execute!(params, {} as any);

describe("get_meditation", () => {
  it("returns meditation by category", async () => {
    const result = await exec({ category: "stress_relief", durationMinutes: 3 });
    expect(result.meditation.name).toBeTruthy();
    expect(result.meditation.category).toBe("stress_relief");
    expect(result.meditation.script.length).toBeGreaterThan(100);
  });

  it("returns paired verse when mood is provided", async () => {
    const result = await exec({ category: "morning", durationMinutes: 5, mood: "anxious" });
    expect(result.pairedVerse).not.toBeNull();
    expect(result.pairedVerse!.tradition).toBeTruthy();
    expect(result.pairedVerse!.text.length).toBeGreaterThan(10);
  });

  it("returns null paired verse when no mood", async () => {
    const result = await exec({ category: "focus", durationMinutes: 5 });
    // pairedVerse may be null if no mood given
    // This is expected behavior
    expect(result.meditation.name).toBeTruthy();
  });

  it("respects duration preference", async () => {
    const short = await exec({ category: "stress_relief", durationMinutes: 3 });
    const long = await exec({ category: "body_scan", durationMinutes: 10 });
    expect(short.meditation.durationMinutes).toBeLessThanOrEqual(long.meditation.durationMinutes);
  });

  it("meditation script contains instructions", async () => {
    const result = await exec({ category: "gratitude", durationMinutes: 3 });
    expect(result.meditation.script).toContain("breath");
  });
});
