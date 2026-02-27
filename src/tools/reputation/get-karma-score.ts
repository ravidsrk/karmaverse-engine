import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getDecisionsByUser } from "../../db";

/**
 * Karma Score — standalone Layer 4 (Reputation) tool.
 * Composite score from 5 components:
 *   Grounding (20%), Decision Quality (25%), Reflection Discipline (20%),
 *   Pattern Awareness (15%), Value Alignment (20%)
 *
 * Levels (from 09-reputation-ethics.md):
 *   0-20: Beginning | 21-40: Awakening | 41-60: Growing | 61-80: Flourishing | 81-100: Mastery
 */

export const KARMA_LEVELS = [
  { min: 0, max: 20, label: "Beginning", description: "Just starting the journey of mindful decision-making" },
  { min: 21, max: 40, label: "Awakening", description: "Building awareness of patterns and biases" },
  { min: 41, max: 60, label: "Growing", description: "Consistent practice, deepening reflection" },
  { min: 61, max: 80, label: "Flourishing", description: "Strong pattern recognition, aligned decisions" },
  { min: 81, max: 100, label: "Mastery", description: "Deeply intentional, teaching through example" },
];

export function getKarmaLevel(score: number): typeof KARMA_LEVELS[number] {
  return KARMA_LEVELS.reduce((acc, l) => (score >= l.min ? l : acc), KARMA_LEVELS[0]);
}

export async function computeKarmaScore(userId: string): Promise<{
  score: number;
  level: string;
  levelDescription: string;
  breakdown: {
    grounding: number;
    decisionQuality: number;
    reflectionDiscipline: number;
    patternAwareness: number;
    valueAlignment: number;
  };
  nextMilestone: { level: string; pointsNeeded: number } | null;
  suggestion: string;
  stats: {
    totalDecisions: number;
    totalReflections: number;
    avgSatisfaction: number | null;
    biasesIdentified: string[];
  };
}> {
  const allDecisions = await getDecisionsByUser(userId);
  const withOutcomes = allDecisions.filter((d) => d.outcome !== null);

  const avgSatisfaction =
    withOutcomes.length > 0
      ? withOutcomes.reduce((sum: number, d: any) => sum + (d.outcome?.satisfaction || 0), 0) / withOutcomes.length
      : null;

  const allBiases = allDecisions
    .filter((d) => d.biasesFlagged && d.biasesFlagged.length > 0)
    .flatMap((d: any) => d.biasesFlagged as string[]);
  const uniqueBiases = [...new Set(allBiases)];

  const noRegretCount = withOutcomes.filter((d) => !d.outcome?.wouldChooseDifferently).length;

  // 5 components (0-100 each)
  const grounding = 50; // Default — would come from mindfulness session tracking
  const decisionQuality = avgSatisfaction ? (avgSatisfaction / 10) * 100 : 50;
  const reflectionDiscipline =
    allDecisions.length > 0 ? (withOutcomes.length / allDecisions.length) * 100 : 0;
  const patternAwareness = uniqueBiases.length > 0 ? Math.min(100, 40 + uniqueBiases.length * 10) : 40;
  const valueAlignment =
    noRegretCount > 0 ? (noRegretCount / Math.max(withOutcomes.length, 1)) * 100 : 50;

  const score = Math.round(
    grounding * 0.2 +
    decisionQuality * 0.25 +
    reflectionDiscipline * 0.2 +
    patternAwareness * 0.15 +
    valueAlignment * 0.2
  );

  const clampedScore = Math.min(100, Math.max(0, score));
  const level = getKarmaLevel(clampedScore);

  // Next milestone
  const currentLevelIndex = KARMA_LEVELS.indexOf(level);
  const nextLevel = currentLevelIndex < KARMA_LEVELS.length - 1 ? KARMA_LEVELS[currentLevelIndex + 1] : null;
  const nextMilestone = nextLevel ? { level: nextLevel.label, pointsNeeded: nextLevel.min - clampedScore } : null;

  // Suggestion based on weakest component
  const components = { grounding, decisionQuality, reflectionDiscipline, patternAwareness, valueAlignment };
  const weakest = Object.entries(components).reduce((a, b) => (a[1] < b[1] ? a : b));
  const suggestions: Record<string, string> = {
    grounding: "Try a daily mindfulness check-in to strengthen your grounding score.",
    decisionQuality: "Use the decision framework tool before important choices to improve quality.",
    reflectionDiscipline: "You have decisions awaiting reflection. Reviewing outcomes builds wisdom.",
    patternAwareness: "Run the bias detection tool more often to uncover hidden patterns.",
    valueAlignment: "Review past decisions against your stated values to improve alignment.",
  };

  return {
    score: clampedScore,
    level: level.label,
    levelDescription: level.description,
    breakdown: {
      grounding: Math.round(grounding),
      decisionQuality: Math.round(decisionQuality),
      reflectionDiscipline: Math.round(reflectionDiscipline),
      patternAwareness: Math.round(patternAwareness),
      valueAlignment: Math.round(valueAlignment),
    },
    nextMilestone,
    suggestion: suggestions[weakest[0]],
    stats: {
      totalDecisions: allDecisions.length,
      totalReflections: withOutcomes.length,
      avgSatisfaction: avgSatisfaction ? Math.round(avgSatisfaction * 10) / 10 : null,
      biasesIdentified: uniqueBiases,
    },
  };
}

export const getKarmaScore = createTool({
  id: "get_karma_score",
  description:
    "Get the user's Karma Score — a composite reputation metric (0-100) based on 5 components: Grounding (mindfulness), Decision Quality, Reflection Discipline, Pattern Awareness, and Value Alignment. Includes level label, breakdown, next milestone, and improvement suggestion.",
  inputSchema: z.object({
    userId: z.string().default("default").describe("User identifier"),
    includeBreakdown: z
      .boolean()
      .default(true)
      .describe("Include component-by-component breakdown"),
  }),
  outputSchema: z.object({
    score: z.number(),
    level: z.string(),
    levelDescription: z.string(),
    breakdown: z
      .object({
        grounding: z.number(),
        decisionQuality: z.number(),
        reflectionDiscipline: z.number(),
        patternAwareness: z.number(),
        valueAlignment: z.number(),
      })
      .optional(),
    nextMilestone: z
      .object({
        level: z.string(),
        pointsNeeded: z.number(),
      })
      .nullable(),
    suggestion: z.string(),
    stats: z.object({
      totalDecisions: z.number(),
      totalReflections: z.number(),
      avgSatisfaction: z.number().nullable(),
      biasesIdentified: z.array(z.string()),
    }),
  }),
  execute: async (params) => {
    const { userId, includeBreakdown } = params;
    const result = await computeKarmaScore(userId);

    if (!includeBreakdown) {
      const { breakdown, ...rest } = result;
      return rest as any;
    }

    return result;
  },
});
