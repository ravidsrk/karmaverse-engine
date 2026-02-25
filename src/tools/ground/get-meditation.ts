import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { meditationTemplates, wisdomVerses } from "../../data/wisdom";

export const getMeditation = createTool({
  id: "get_meditation",
  description:
    "Generate a guided meditation script. Choose by category (morning, stress_relief, focus, gratitude, body_scan) and duration. Returns a full script with optional paired verse.",
  inputSchema: z.object({
    category: z
      .enum(["morning", "stress_relief", "focus", "gratitude", "body_scan"])
      .default("stress_relief")
      .describe("Type of meditation"),
    durationMinutes: z.number().min(3).max(15).default(5).describe("Desired duration in minutes"),
    mood: z.string().optional().describe("Current mood for personalization"),
    context: z.string().optional().describe("User's current situation for personalization"),
  }),
  outputSchema: z.object({
    meditation: z.object({
      name: z.string(),
      category: z.string(),
      durationMinutes: z.number(),
      style: z.string(),
      script: z.string(),
    }),
    pairedVerse: z
      .object({
        tradition: z.string(),
        reference: z.string(),
        text: z.string(),
        interpretation: z.string(),
      })
      .nullable(),
  }),
  execute: async (params) => {
    const { category, durationMinutes, mood } = params;

    // Find best matching template
    const candidates = meditationTemplates
      .filter((t) => t.category === category)
      .sort((a, b) => Math.abs(a.durationMinutes - durationMinutes) - Math.abs(b.durationMinutes - durationMinutes));

    const template = candidates[0] || meditationTemplates[0];

    // Find a paired verse based on mood
    let pairedVerse = null;
    if (mood) {
      const verse = wisdomVerses.find((v) => v.moodTags.includes(mood));
      if (verse) {
        pairedVerse = {
          tradition: verse.tradition,
          reference: verse.reference,
          text: verse.text,
          interpretation: verse.interpretation,
        };
      }
    }

    return {
      meditation: {
        name: template.name,
        category: template.category,
        durationMinutes: template.durationMinutes,
        style: template.style,
        script: template.script,
      },
      pairedVerse,
    };
  },
});
