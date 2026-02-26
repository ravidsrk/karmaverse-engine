import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { meditationTemplates, wisdomVerses } from "../../data/index";
import { personalizeMeditation, isAiAvailable, type Persona } from "../../ai";

export const getMeditation = createTool({
  id: "get_meditation",
  description:
    "Generate a guided meditation script. Supports 9 categories, multiple durations, and structured response with intro/body/closing sections. Optional AI personalization with mood and context.",
  inputSchema: z.object({
    category: z
      .enum(["morning", "stress_relief", "focus", "gratitude", "body_scan", "loving_kindness", "evening_wind_down", "mantra", "visualization"])
      .default("stress_relief")
      .describe("Type of meditation"),
    durationMinutes: z.number().min(3).max(30).default(5).describe("Desired duration in minutes"),
    mood: z.string().optional().describe("Current mood for personalization"),
    context: z.string().optional().describe("User's current situation for personalization"),
    style: z.enum(["guided", "silent_timer", "mantra", "visualization"]).optional().describe("Preferred meditation style"),
    timeOfDay: z.enum(["morning", "afternoon", "evening", "night"]).optional().describe("Time of day for contextual adaptation"),
    persona: z.enum(["teacher", "friend", "monk"]).optional().describe("Guide voice style"),
  }),
  outputSchema: z.object({
    meditation: z.object({
      name: z.string(),
      category: z.string(),
      durationMinutes: z.number(),
      style: z.string(),
      script: z.string(),
      structured: z.object({
        intro: z.object({ text: z.string(), durationSeconds: z.number() }),
        body: z.array(z.object({
          phase: z.string(),
          text: z.string(),
          durationSeconds: z.number(),
        })),
        closing: z.object({ text: z.string(), durationSeconds: z.number() }),
      }).optional(),
    }),
    pairedVerse: z
      .object({
        tradition: z.string(),
        reference: z.string(),
        text: z.string(),
        interpretation: z.string(),
      })
      .nullable(),
    aiPersonalized: z.boolean().optional(),
  }),
  execute: async (params) => {
    const { category, durationMinutes, mood, context, style, timeOfDay, persona } = params;

    // Find best matching template (by category, then duration, then style)
    let candidates = meditationTemplates.filter((t) => t.category === category);
    if (style) {
      const styleMatch = candidates.filter((t) => t.style === style);
      if (styleMatch.length > 0) candidates = styleMatch;
    }
    candidates.sort((a, b) => Math.abs(a.durationMinutes - durationMinutes) - Math.abs(b.durationMinutes - durationMinutes));

    const template = candidates[0] || meditationTemplates[0];

    // Build structured response
    let structured: any = undefined;
    let aiPersonalized = false;

    if (isAiAvailable() && context) {
      // AI-personalized structured meditation
      structured = await personalizeMeditation({
        templateScript: template.script,
        category: template.category,
        durationMinutes: template.durationMinutes,
        mood,
        userContext: context,
        timeOfDay,
        persona: persona as Persona,
      });
      aiPersonalized = true;
    } else {
      // Static structured response from template
      const totalSec = template.durationMinutes * 60;
      const introSec = Math.round(Math.min(30, totalSec * 0.1));
      const closingSec = Math.round(Math.min(30, totalSec * 0.1));
      const bodySec = totalSec - introSec - closingSec;

      // Split script into sections heuristically
      const lines = template.script.split("\n\n").filter((l) => l.trim());
      const introText = lines[0] || "Find a comfortable position and close your eyes. Take a deep breath.";
      const closingText = lines[lines.length - 1] || "When you're ready, open your eyes slowly.";
      const bodyText = lines.slice(1, -1).join("\n\n") || template.script;

      structured = {
        intro: { text: introText, durationSeconds: introSec },
        body: [
          { phase: "settling", text: bodyText.slice(0, Math.floor(bodyText.length * 0.3)), durationSeconds: Math.round(bodySec * 0.3) },
          { phase: "core", text: bodyText.slice(Math.floor(bodyText.length * 0.3), Math.floor(bodyText.length * 0.8)), durationSeconds: Math.round(bodySec * 0.5) },
          { phase: "deepening", text: bodyText.slice(Math.floor(bodyText.length * 0.8)), durationSeconds: Math.round(bodySec * 0.2) },
        ],
        closing: { text: closingText, durationSeconds: closingSec },
      };
    }

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
        structured,
      },
      pairedVerse,
      ...(aiPersonalized ? { aiPersonalized } : {}),
    };
  },
});
