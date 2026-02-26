import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { breathworkExercises } from "../../data/index";

export const getBreathingExercise = createTool({
  id: "get_breathing_exercise",
  description:
    "Get a structured breathwork exercise with step-by-step instructions and timing. Choose by use case (anxiety, focus, sleep, energy) or get a recommendation based on mood.",
  inputSchema: z.object({
    useCase: z
      .enum(["anxiety", "focus", "sleep", "energy", "calm", "stress", "pre-decision", "morning", "relaxation"])
      .optional()
      .describe("What the breathing exercise is for"),
    mood: z
      .enum(["anxious", "sad", "angry", "frustrated", "restless", "overwhelmed", "hopeless", "lonely", "confused"])
      .optional()
      .describe("Current emotional state"),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner").describe("Skill level"),
    slug: z.string().optional().describe("Specific exercise by slug (e.g., 'box-breathing')"),
    durationMinutes: z.number().min(1).max(15).optional().describe("Desired duration — adjusts number of cycles"),
  }),
  outputSchema: z.object({
    exercise: z.object({
      name: z.string(),
      description: z.string(),
      difficulty: z.string(),
      totalDurationSeconds: z.number(),
      steps: z.array(
        z.object({
          instruction: z.string(),
          durationSeconds: z.number(),
          phase: z.string(),
        })
      ),
      useCases: z.array(z.string()),
      whyThisOne: z.string(),
    }),
  }),
  execute: async (params) => {
    const { useCase, mood, difficulty, slug, durationMinutes } = params;

    let exercise;

    if (slug) {
      exercise = breathworkExercises.find((e) => e.slug === slug);
    }

    if (!exercise) {
      // Score exercises
      const scored = breathworkExercises
        .filter((e) => e.difficulty === difficulty || difficulty === "beginner")
        .map((e) => {
          let score = 0;
          if (useCase && e.useCases.includes(useCase)) score += 3;
          if (mood && e.moodTags.includes(mood)) score += 2;
          if (e.difficulty === difficulty) score += 1;
          return { exercise: e, score };
        })
        .sort((a, b) => b.score - a.score);

      exercise = scored[0]?.exercise || breathworkExercises[0];
    }

    let whyThisOne = "Recommended for general wellness.";
    if (useCase && exercise.useCases.includes(useCase)) {
      whyThisOne = `Specifically designed for ${useCase}.`;
    } else if (mood && exercise.moodTags.includes(mood)) {
      whyThisOne = `Matches your current mood (${mood}) — helps with ${exercise.useCases[0]}.`;
    }

    // Adjust duration if durationMinutes specified
    let totalDurationSeconds = exercise.totalDurationSeconds;
    let adjustedSteps = exercise.steps;
    if (durationMinutes) {
      const targetSeconds = durationMinutes * 60;
      const oneCycleSeconds = exercise.steps.reduce((sum, s) => sum + s.durationSeconds, 0);
      const cycles = Math.max(1, Math.round(targetSeconds / oneCycleSeconds));
      totalDurationSeconds = oneCycleSeconds * cycles;
      whyThisOne += ` Adjusted to ~${cycles} cycles for your ${durationMinutes}-minute window.`;
    }

    return {
      exercise: {
        name: exercise.name,
        description: exercise.description,
        difficulty: exercise.difficulty,
        totalDurationSeconds,
        steps: adjustedSteps,
        useCases: exercise.useCases,
        whyThisOne,
      },
    };
  },
});
