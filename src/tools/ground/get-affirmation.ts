import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { affirmations } from "../../data/index";
import { personalizeAffirmation, isAiAvailable, type Persona } from "../../ai";

export const getAffirmation = createTool({
  id: "get_affirmation",
  description:
    "Get a personalized affirmation rooted in wisdom traditions. 8 categories. Supports AI personalization with user context and persona.",
  inputSchema: z.object({
    category: z
      .enum(["calm", "resilience", "purpose", "confidence", "gratitude", "focus", "self-worth", "letting_go"])
      .optional()
      .describe("Affirmation category"),
    mood: z.string().optional().describe("Current emotional state"),
    tradition: z.enum(["gita", "stoic", "buddhist", "yoga_sutras", "any"]).default("any").describe("Preferred tradition"),
    userContext: z.string().optional().describe("User's situation for AI-personalized affirmation"),
    persona: z.enum(["teacher", "friend", "monk"]).optional().describe("Interpretation style"),
  }),
  outputSchema: z.object({
    affirmation: z.object({
      text: z.string(),
      personalizedText: z.string().optional(),
      category: z.string(),
      tradition: z.string(),
    }),
    suggestion: z.string(),
    aiPersonalized: z.boolean().optional(),
  }),
  execute: async (params) => {
    const { category, mood, tradition, userContext, persona } = params;

    let candidates = [...affirmations];

    if (category) {
      candidates = candidates.filter((a) => a.category === category);
    }

    if (tradition && tradition !== "any") {
      const filtered = candidates.filter((a) => a.tradition === tradition);
      if (filtered.length > 0) candidates = filtered;
    }

    if (mood) {
      const moodMatched = candidates.filter((a) => a.moodTags.includes(mood));
      if (moodMatched.length > 0) candidates = moodMatched;
    }

    // Pick one
    const picked = candidates[Math.floor(Math.random() * candidates.length)] || affirmations[0];

    // AI personalization if context provided
    let personalizedText: string | undefined;
    let aiPersonalized = false;

    if (userContext && isAiAvailable()) {
      personalizedText = await personalizeAffirmation({
        baseText: picked.text,
        category: picked.category,
        userContext,
        tradition: picked.tradition,
        persona: persona as Persona,
      });
      aiPersonalized = personalizedText !== picked.text;
    }

    const suggestions: Record<string, string> = {
      calm: "Repeat this silently 3 times. With each repetition, let your shoulders drop a little further.",
      resilience: "Write this down and keep it visible today. Read it when difficulty arrives.",
      purpose: "Set this as your intention for the day. Revisit it before any big decision.",
      confidence: "Stand tall, breathe deeply, and say this to yourself. Your posture shapes your mindset.",
      gratitude: "Before reacting to anything today, recall this affirmation first.",
      focus: "Place this at the top of your workspace. Return to it when distraction calls.",
      "self-worth": "Say this to yourself the way you'd say it to someone you deeply care about.",
      letting_go: "As you exhale, imagine releasing this. Let go a little more with each breath.",
    };

    return {
      affirmation: {
        text: picked.text,
        ...(personalizedText && aiPersonalized ? { personalizedText } : {}),
        category: picked.category,
        tradition: picked.tradition,
      },
      suggestion: suggestions[picked.category] || "Carry this with you today.",
      ...(aiPersonalized ? { aiPersonalized } : {}),
    };
  },
});
