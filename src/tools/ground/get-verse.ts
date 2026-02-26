import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { wisdomVerses } from "../../data/index";
import { personalizeVerse, isAiAvailable, type Persona } from "../../ai";

export const getVerse = createTool({
  id: "get_verse",
  description:
    "Fetch a specific verse by tradition and reference (e.g., 'Gita 2.47' or 'Epictetus 1'). Returns full text, interpretation, and themes. Supports AI personalization with user_context and persona.",
  inputSchema: z.object({
    tradition: z.enum(["gita", "stoic", "buddhist", "yoga_sutras"]).describe("The wisdom tradition"),
    reference: z.string().optional().describe("Specific verse reference (e.g., '2.47', 'Chapter 1')"),
    id: z.string().optional().describe("Direct verse ID if known"),
    userContext: z.string().optional().describe("User's current situation for personalized interpretation"),
    persona: z.enum(["teacher", "friend", "monk"]).optional().describe("Interpretation style: teacher (scholarly), friend (casual), monk (contemplative)"),
  }),
  outputSchema: z.object({
    found: z.boolean(),
    verse: z
      .object({
        id: z.string(),
        tradition: z.string(),
        source: z.string(),
        reference: z.string(),
        text: z.string(),
        interpretation: z.string(),
        personalizedInterpretation: z.string().optional(),
        themes: z.array(z.string()),
        moodTags: z.array(z.string()),
        persona: z.string().optional(),
        aiPersonalized: z.boolean().optional(),
      })
      .nullable(),
  }),
  execute: async (params) => {
    const { tradition, reference, id, userContext, persona } = params;

    let verse = null;

    if (id) {
      verse = wisdomVerses.find((v) => v.id === id) || null;
    } else if (reference) {
      const refLower = reference.toLowerCase();
      verse =
        wisdomVerses.find(
          (v) =>
            v.tradition === tradition &&
            (v.reference.toLowerCase().includes(refLower) || v.id.toLowerCase().includes(refLower))
        ) || null;
    } else {
      // Random verse from tradition
      const traditionVerses = wisdomVerses.filter((v) => v.tradition === tradition);
      verse = traditionVerses[Math.floor(Math.random() * traditionVerses.length)] || null;
    }

    if (!verse) {
      return { found: false, verse: null };
    }

    // AI personalization if context provided
    let personalizedInterpretation: string | undefined;
    let aiPersonalized = false;

    if (userContext && isAiAvailable()) {
      personalizedInterpretation = await personalizeVerse({
        tradition: verse.tradition,
        reference: verse.reference,
        text: verse.text,
        baseInterpretation: verse.interpretation,
        userContext,
        persona: persona as Persona,
      });
      aiPersonalized = personalizedInterpretation !== verse.interpretation;
    }

    return {
      found: true,
      verse: {
        id: verse.id,
        tradition: verse.tradition,
        source: verse.source,
        reference: verse.reference,
        text: verse.text,
        interpretation: verse.interpretation,
        ...(personalizedInterpretation ? { personalizedInterpretation } : {}),
        themes: verse.themes,
        moodTags: verse.moodTags,
        ...(persona ? { persona } : {}),
        ...(aiPersonalized ? { aiPersonalized } : {}),
      },
    };
  },
});
