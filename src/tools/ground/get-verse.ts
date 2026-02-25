import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { wisdomVerses } from "../../data/wisdom";

export const getVerse = createTool({
  id: "get_verse",
  description:
    "Fetch a specific verse by tradition and reference (e.g., 'Gita 2.47' or 'Epictetus 1'). Returns full text, interpretation, and themes.",
  inputSchema: z.object({
    tradition: z.enum(["gita", "stoic", "buddhist", "yoga_sutras"]).describe("The wisdom tradition"),
    reference: z.string().optional().describe("Specific verse reference (e.g., '2.47', 'Chapter 1')"),
    id: z.string().optional().describe("Direct verse ID if known"),
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
        themes: z.array(z.string()),
        moodTags: z.array(z.string()),
      })
      .nullable(),
  }),
  execute: async (params) => {
    const { tradition, reference, id } = params;

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

    return {
      found: verse !== null,
      verse: verse
        ? {
            id: verse.id,
            tradition: verse.tradition,
            source: verse.source,
            reference: verse.reference,
            text: verse.text,
            interpretation: verse.interpretation,
            themes: verse.themes,
            moodTags: verse.moodTags,
          }
        : null,
    };
  },
});
