import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getDecisionStore } from "../decide/log-decision";
import { wisdomVerses } from "../../data/index";

export const generateReflection = createTool({
  id: "generate_reflection",
  description:
    "Generate a structured reflection report (weekly, monthly, or quarterly). Summarizes decisions made, outcomes logged, patterns observed, and provides a wisdom verse for the period ahead.",
  inputSchema: z.object({
    userId: z.string().default("default").describe("User identifier"),
    period: z.enum(["weekly", "monthly", "quarterly"]).default("weekly"),
    includeWisdom: z.boolean().default(true).describe("Include a wisdom verse for the next period"),
  }),
  outputSchema: z.object({
    period: z.string(),
    summary: z.object({
      decisionsLogged: z.number(),
      outcomesRecorded: z.number(),
      avgSatisfaction: z.number().nullable(),
      biasesFlagged: z.array(z.string()),
    }),
    highlights: z.array(z.string()),
    growthAreas: z.array(z.string()),
    wisdomForNextPeriod: z.object({
      tradition: z.string(),
      reference: z.string(),
      text: z.string(),
      whyThisOne: z.string(),
    }),
    karmaScoreEstimate: z.object({
      score: z.number(),
      level: z.string(),
      trend: z.string(),
    }),
  }),
  execute: async (params) => {
    const { userId, period, includeWisdom } = params;
    const store = getDecisionStore();

    // Calculate period range
    const now = new Date();
    const periodDays = period === "weekly" ? 7 : period === "monthly" ? 30 : 90;
    const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    // Gather decisions in period
    const allDecisions = Array.from(store.values()).filter(
      (d) => d.userId === userId && new Date(d.loggedAt) >= periodStart
    );
    const withOutcomes = allDecisions.filter((d) => d.outcome !== null);

    // Calculate stats
    const avgSatisfaction = withOutcomes.length > 0
      ? withOutcomes.reduce((sum: number, d: any) => sum + (d.outcome?.satisfaction || 0), 0) / withOutcomes.length
      : null;

    const allBiases = allDecisions
      .filter((d) => d.biasesFlagged && d.biasesFlagged.length > 0)
      .flatMap((d: any) => d.biasesFlagged as string[]);
    const uniqueBiases = [...new Set(allBiases)];

    // Generate highlights
    const highlights: string[] = [];
    if (allDecisions.length > 0) {
      highlights.push(`You logged ${allDecisions.length} decision(s) this ${period === "weekly" ? "week" : period === "monthly" ? "month" : "quarter"}.`);
    }
    if (withOutcomes.length > 0) {
      highlights.push(`You reflected on ${withOutcomes.length} outcome(s). Reflection is the engine of growth.`);
    }
    if (avgSatisfaction && avgSatisfaction >= 7) {
      highlights.push(`Strong satisfaction (${avgSatisfaction.toFixed(1)}/10) — your decision process is working.`);
    }
    const noRegretCount = withOutcomes.filter((d) => !d.outcome?.wouldChooseDifferently).length;
    if (noRegretCount > 0) {
      highlights.push(`${noRegretCount} decision(s) you'd make again. That's conviction.`);
    }
    if (highlights.length === 0) {
      highlights.push("A quiet period. Sometimes stillness is its own form of progress.");
    }

    // Growth areas
    const growthAreas: string[] = [];
    if (uniqueBiases.length > 0) {
      growthAreas.push(`Watch for: ${uniqueBiases.join(", ")}. These biases appeared in your reasoning.`);
    }
    if (avgSatisfaction && avgSatisfaction < 5) {
      growthAreas.push("Satisfaction is below 5 — consider grounding yourself before major decisions next period.");
    }
    if (allDecisions.length === 0) {
      growthAreas.push("No decisions logged. Try logging even small decisions to build the habit.");
    }
    if (withOutcomes.length < allDecisions.length) {
      growthAreas.push(`${allDecisions.length - withOutcomes.length} decision(s) still pending reflection. Circle back when outcomes are clear.`);
    }
    if (growthAreas.length === 0) {
      growthAreas.push("No specific areas flagged. Keep doing what you're doing.");
    }

    // Wisdom for next period
    const randomVerse = wisdomVerses[Math.floor(Math.random() * wisdomVerses.length)];

    // Karma Score estimate (simplified formula)
    const groundingScore = 50; // Default — would come from session tracking
    const decisionQuality = avgSatisfaction ? (avgSatisfaction / 10) * 100 : 50;
    const reflectionDiscipline = allDecisions.length > 0 ? (withOutcomes.length / allDecisions.length) * 100 : 0;
    const patternAwareness = uniqueBiases.length > 0 ? 60 : 40; // At least aware of biases
    const valueAlignment = noRegretCount > 0 ? (noRegretCount / Math.max(withOutcomes.length, 1)) * 100 : 50;

    const karmaScore = Math.round(
      groundingScore * 0.2 +
      decisionQuality * 0.25 +
      reflectionDiscipline * 0.2 +
      patternAwareness * 0.15 +
      valueAlignment * 0.2
    );

    // Thresholds from 09-reputation-ethics.md:
    // 0-20: Beginning | 21-40: Awakening | 41-60: Growing | 61-80: Flourishing | 81-100: Mastery
    const levels = [
      { min: 0, label: "Beginning" },
      { min: 21, label: "Awakening" },
      { min: 41, label: "Growing" },
      { min: 61, label: "Flourishing" },
      { min: 81, label: "Mastery" },
    ];
    const level = levels.reduce((acc, l) => (karmaScore >= l.min ? l : acc), levels[0]);

    return {
      period: `${period} (${periodStart.toISOString().split("T")[0]} to ${now.toISOString().split("T")[0]})`,
      summary: {
        decisionsLogged: allDecisions.length,
        outcomesRecorded: withOutcomes.length,
        avgSatisfaction: avgSatisfaction ? Math.round(avgSatisfaction * 10) / 10 : null,
        biasesFlagged: uniqueBiases,
      },
      highlights,
      growthAreas,
      wisdomForNextPeriod: includeWisdom !== false ? {
        tradition: randomVerse.tradition,
        reference: randomVerse.reference,
        text: randomVerse.text,
        whyThisOne: `Carry this wisdom into the next ${period === "weekly" ? "week" : period === "monthly" ? "month" : "quarter"}.`,
      } : null as any,
      karmaScoreEstimate: {
        score: karmaScore,
        level: level.label,
        trend: withOutcomes.length >= 3 ? (avgSatisfaction && avgSatisfaction > 5 ? "↑ improving" : "→ stable") : "— insufficient data for trend",
      },
    };
  },
});
