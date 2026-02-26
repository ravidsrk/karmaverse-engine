import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { wisdomVerses } from "../../data/index";

export const getWisdomCounsel = createTool({
  id: "get_wisdom_counsel",
  description:
    "Get multi-tradition wisdom counsel on a dilemma. Returns perspectives from multiple wisdom traditions on the same topic — showing how different philosophies approach the same human challenge.",
  inputSchema: z.object({
    dilemma: z.string().describe("The dilemma or question seeking wisdom"),
    traditions: z
      .array(z.enum(["gita", "stoic", "buddhist", "yoga_sutras"]))
      .default(["gita", "stoic", "buddhist"])
      .describe("Which traditions to consult"),
    depth: z.enum(["brief", "detailed"]).default("brief").describe("Brief (1 verse each) or detailed (context + interpretation)"),
  }),
  outputSchema: z.object({
    dilemma: z.string(),
    counsel: z.array(
      z.object({
        tradition: z.string(),
        source: z.string(),
        reference: z.string(),
        text: z.string(),
        interpretation: z.string(),
        applicationToYou: z.string(),
      })
    ),
    synthesis: z.string(),
  }),
  execute: async (params) => {
    const { dilemma, traditions, depth } = params;
    const dilemmaLower = dilemma.toLowerCase();

    // Find best verse per tradition
    const counsel = traditions.map((tradition) => {
      const traditionVerses = wisdomVerses.filter((v) => v.tradition === tradition);

      // Score by relevance
      const scored = traditionVerses.map((v) => {
        let score = 0;
        const searchTerms = dilemmaLower.split(/\s+/).filter((t) => t.length > 3);
        for (const term of searchTerms) {
          if (v.text.toLowerCase().includes(term)) score += 2;
          if (v.interpretation.toLowerCase().includes(term)) score += 1;
          if (v.themes.some((t) => t.includes(term))) score += 3;
        }
        // Mood keywords
        for (const tag of v.moodTags) {
          if (dilemmaLower.includes(tag)) score += 2;
        }
        return { verse: v, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const best = scored[0]?.verse || traditionVerses[0];

      const traditionNames: Record<string, string> = {
        gita: "Bhagavad Gita",
        stoic: "Stoic Philosophy",
        buddhist: "Buddhist Wisdom",
        yoga_sutras: "Yoga Sutras",
      };

      return {
        tradition: traditionNames[tradition] || tradition,
        source: best.source,
        reference: best.reference,
        text: best.text,
        interpretation: depth === "detailed" ? best.interpretation : best.interpretation.split(".")[0] + ".",
        applicationToYou: `Consider this perspective when thinking about: "${dilemma}"`,
      };
    });

    // Synthesis
    const synthesis =
      counsel.length >= 2
        ? `Across ${counsel.length} traditions, common threads emerge: the importance of clarity before action, non-attachment to specific outcomes, and trust in the process of growth. Each tradition approaches your dilemma from a different angle, but they converge on one truth: intentional action, grounded in awareness, leads to better outcomes than reactive behavior.`
        : "This tradition offers a clear perspective. Consider consulting additional traditions for a more complete picture.";

    return {
      dilemma,
      counsel,
      synthesis,
    };
  },
});
