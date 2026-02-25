import { describe, it, expect } from "vitest";
import { mindfulnessCheckIn } from "./mindfulness-check-in";

const exec = (params: any) => mindfulnessCheckIn.execute!(params, {} as any);

describe("mindfulness_check_in", () => {
  it("returns complete grounding session for anxious+high energy", async () => {
    const result = await exec({ mood: "anxious", energy: "high", context: "deadline pressure" });
    expect(result.assessment).toContain("anxiety");
    expect(result.breathing.name).toBeTruthy();
    expect(result.breathing.steps.length).toBeGreaterThan(0);
    expect(result.wisdom.text).toBeTruthy();
    expect(result.grounding.affirmation).toBeTruthy();
    expect(result.followUp).toBeTruthy();
  });

  it("selects belly breathing for low energy", async () => {
    const result = await exec({ mood: "sad", energy: "low" });
    expect(result.breathing.name).toBe("Belly Breathing (Diaphragmatic)");
    expect(result.breathing.whyThisOne).toContain("low energy");
  });

  it("selects box breathing for high energy negative mood", async () => {
    const result = await exec({ mood: "angry", energy: "high" });
    expect(result.breathing.name).toBe("Box Breathing");
  });

  it("provides mood-specific assessment", async () => {
    const moods = ["anxious", "sad", "angry", "confused", "frustrated", "overwhelmed", "lonely", "grateful", "hopeful", "peaceful", "restless"] as const;
    for (const mood of moods) {
      const result = await exec({ mood, energy: "medium" });
      expect(result.assessment.length).toBeGreaterThan(20);
    }
  });

  it("provides mood-specific follow-up", async () => {
    const r1 = await exec({ mood: "anxious", energy: "medium" });
    const r2 = await exec({ mood: "grateful", energy: "medium" });
    expect(r1.followUp).not.toBe(r2.followUp);
  });

  it("personalizes wisdom interpretation when context given", async () => {
    const withContext = await exec({ mood: "confused", energy: "medium", context: "career change" });
    expect(withContext.wisdom.interpretation).toContain("career change");
  });

  it("works without context", async () => {
    const result = await exec({ mood: "peaceful", energy: "medium" });
    expect(result.assessment).toBeTruthy();
    expect(result.wisdom.interpretation).not.toContain("undefined");
  });
});
