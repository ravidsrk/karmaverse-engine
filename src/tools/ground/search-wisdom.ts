import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { wisdomVerses } from "../../data/wisdom";

export const searchWisdom = createTool({
  id: "search_wisdom",
  description:
    "Search spiritual wisdom across traditions (Bhagavad Gita, Stoic philosophy, Buddhist teachings, Yoga Sutras). Returns relevant verses with interpretations based on query, mood, or life situation.",
  inputSchema: z.object({
    query: z.string().describe("Natural language query about a life situation, emotion, or topic"),
    mood: z
      .enum(["anxious", "sad", "angry", "confused", "restless", "grateful", "hopeful", "peaceful", "overwhelmed", "lonely", "frustrated", "envious", "hopeless"])
      .optional()
      .describe("Current emotional state for better matching"),
    tradition: z
      .enum(["gita", "stoic", "buddhist", "yoga_sutras", "all"])
      .default("all")
      .describe("Filter by wisdom tradition"),
    limit: z.number().min(1).max(10).default(3).describe("Number of results to return"),
  }),
  outputSchema: z.object({
    verses: z.array(
      z.object({
        tradition: z.string(),
        source: z.string(),
        reference: z.string(),
        text: z.string(),
        interpretation: z.string(),
        themes: z.array(z.string()),
        relevanceReason: z.string(),
      })
    ),
    totalAvailable: z.number(),
  }),
  execute: async (params) => {
    const { query, mood, tradition, limit } = params;
    const queryLower = query.toLowerCase();

    // Score each verse based on relevance
    const scored = wisdomVerses
      .filter((v) => tradition === "all" || v.tradition === tradition)
      .map((verse) => {
        let score = 0;
        let reason = "";

        // Mood match
        if (mood && verse.moodTags.includes(mood)) {
          score += 3;
          reason = `Matches your mood: ${mood}`;
        }

        // Theme keyword match
        for (const theme of verse.themes) {
          if (queryLower.includes(theme)) {
            score += 2;
            reason = reason || `Relevant theme: ${theme}`;
          }
        }

        // Text content match
        const searchTerms = queryLower.split(/\s+/).filter((t) => t.length > 3);
        for (const term of searchTerms) {
          if (verse.text.toLowerCase().includes(term) || verse.interpretation.toLowerCase().includes(term)) {
            score += 1;
          }
        }

        // Mood tag overlap with query keywords
        for (const tag of verse.moodTags) {
          if (queryLower.includes(tag)) {
            score += 2;
            reason = reason || `Related to ${tag}`;
          }
        }

        // Minimum relevance if nothing matched — still return something
        if (score === 0) {
          score = Math.random() * 0.5; // tiny random so we get varied defaults
          reason = "General wisdom";
        }

        return { verse, score, reason };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return {
      verses: scored.map((s) => ({
        tradition: s.verse.tradition,
        source: s.verse.source,
        reference: s.verse.reference,
        text: s.verse.text,
        interpretation: s.verse.interpretation,
        themes: s.verse.themes,
        relevanceReason: s.reason,
      })),
      totalAvailable: wisdomVerses.filter((v) => tradition === "all" || v.tradition === tradition).length,
    };
  },
});
