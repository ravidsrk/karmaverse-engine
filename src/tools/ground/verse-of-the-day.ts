import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { wisdomVerses } from "../../data/wisdom";

export const verseOfTheDay = createTool({
  id: "verse_of_the_day",
  description:
    "Get the verse of the day — a daily rotating wisdom verse from any tradition. Same verse for everyone on the same day. Free, no auth required.",
  inputSchema: z.object({
    tradition: z
      .enum(["gita", "stoic", "buddhist", "yoga_sutras", "any"])
      .default("any")
      .describe("Preferred tradition for today's verse"),
  }),
  outputSchema: z.object({
    verse: z.object({
      tradition: z.string(),
      source: z.string(),
      reference: z.string(),
      text: z.string(),
      interpretation: z.string(),
      themes: z.array(z.string()),
    }),
    date: z.string(),
    dayMessage: z.string(),
  }),
  execute: async (params) => {
    const { tradition } = params;

    const candidates = tradition === "any" ? wisdomVerses : wisdomVerses.filter((v) => v.tradition === tradition);

    // Deterministic daily selection based on date
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const index = dayOfYear % candidates.length;
    const verse = candidates[index];

    const dayMessages = [
      "Begin your day with this wisdom.",
      "Carry this teaching with you today.",
      "Let this verse guide your actions today.",
      "Today's invitation: sit with this for a moment before starting your day.",
      "A moment of wisdom to ground your morning.",
      "Today's anchor — return to this verse when things get chaotic.",
      "Start here. End here. Let this verse bookend your day.",
    ];
    const dayMessage = dayMessages[dayOfYear % dayMessages.length];

    return {
      verse: {
        tradition: verse.tradition,
        source: verse.source,
        reference: verse.reference,
        text: verse.text,
        interpretation: verse.interpretation,
        themes: verse.themes,
      },
      date: today.toISOString().split("T")[0],
      dayMessage,
    };
  },
});
