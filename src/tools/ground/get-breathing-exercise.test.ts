import { describe, it, expect } from "vitest";
import { getBreathingExercise } from "./get-breathing-exercise";

const exec = (params: any) => getBreathingExercise.execute!(params, {} as any);

describe("get_breathing_exercise", () => {
  it("returns exercise by use case", async () => {
    const result = await exec({ useCase: "anxiety", difficulty: "beginner" });
    expect(result.exercise.name).toBeTruthy();
    expect(result.exercise.steps.length).toBeGreaterThan(0);
    expect(result.exercise.useCases).toContain("anxiety");
  });

  it("returns exercise by slug", async () => {
    const result = await exec({ slug: "box-breathing", difficulty: "beginner" });
    expect(result.exercise.name).toBe("Box Breathing");
  });

  it("returns exercise by mood", async () => {
    const result = await exec({ mood: "overwhelmed", difficulty: "beginner" });
    expect(result.exercise.name).toBeTruthy();
    expect(result.exercise.whyThisOne).toBeTruthy();
  });

  it("exercise has valid step structure", async () => {
    const result = await exec({ useCase: "focus", difficulty: "beginner" });
    for (const step of result.exercise.steps) {
      expect(step.instruction).toBeTruthy();
      expect(step.durationSeconds).toBeGreaterThan(0);
      expect(step.phase).toBeTruthy();
    }
  });

  it("returns total duration", async () => {
    const result = await exec({ slug: "4-7-8-breathing", difficulty: "beginner" });
    expect(result.exercise.totalDurationSeconds).toBeGreaterThan(60);
  });

  it("provides a reason for selection", async () => {
    const result = await exec({ useCase: "anxiety", difficulty: "beginner" });
    expect(result.exercise.whyThisOne).toBeTruthy();
    expect(result.exercise.whyThisOne.length).toBeGreaterThan(10);
  });
});
