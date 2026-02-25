import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getDecisionStore } from "../decide/log-decision";

export const detectPatterns = createTool({
  id: "detect_patterns",
  description:
    "Analyze decision history to find recurring behavioral patterns. Requires at least 3 decisions with outcomes. Detects patterns in timing, emotional state, decision quality, and bias recurrence.",
  inputSchema: z.object({
    userId: z.string().default("default").describe("User identifier"),
  }),
  outputSchema: z.object({
    patternsFound: z.array(
      z.object({
        type: z.string(),
        description: z.string(),
        confidence: z.enum(["low", "medium", "high"]),
        recommendation: z.string(),
        evidence: z.string(),
      })
    ),
    totalDecisions: z.number(),
    totalWithOutcomes: z.number(),
    insufficientData: z.boolean(),
    message: z.string(),
  }),
  execute: async (params) => {
    const { userId } = params;
    const store = getDecisionStore();

    // Gather user's decisions
    const allDecisions = Array.from(store.values()).filter((d) => d.userId === userId);
    const withOutcomes = allDecisions.filter((d) => d.outcome !== null);

    if (withOutcomes.length < 3) {
      return {
        patternsFound: [],
        totalDecisions: allDecisions.length,
        totalWithOutcomes: withOutcomes.length,
        insufficientData: true,
        message: `Need at least 3 decisions with outcomes for pattern detection. You have ${withOutcomes.length}. Log ${3 - withOutcomes.length} more outcome(s) to unlock patterns.`,
      };
    }

    const patterns: Array<{
      type: string;
      description: string;
      confidence: "low" | "medium" | "high";
      recommendation: string;
      evidence: string;
    }> = [];

    // Pattern 1: Satisfaction by confidence level
    const highConfidence = withOutcomes.filter((d) => d.confidenceLevel && d.confidenceLevel >= 7);
    const lowConfidence = withOutcomes.filter((d) => d.confidenceLevel && d.confidenceLevel <= 4);

    if (highConfidence.length >= 2 && lowConfidence.length >= 1) {
      const highAvgSatisfaction = highConfidence.reduce((sum: number, d: any) => sum + (d.outcome?.satisfaction || 5), 0) / highConfidence.length;
      const lowAvgSatisfaction = lowConfidence.reduce((sum: number, d: any) => sum + (d.outcome?.satisfaction || 5), 0) / lowConfidence.length;

      if (Math.abs(highAvgSatisfaction - lowAvgSatisfaction) > 1.5) {
        patterns.push({
          type: "confidence_calibration",
          description: highAvgSatisfaction > lowAvgSatisfaction
            ? "Your high-confidence decisions tend to have better outcomes. Trust your gut when you're sure."
            : "Interestingly, your less confident decisions sometimes lead to better outcomes. Over-confidence may be hurting you.",
          confidence: "medium",
          recommendation: highAvgSatisfaction > lowAvgSatisfaction
            ? "When confidence is high, decide faster. When it's low, take more time."
            : "Be cautious when you feel very certain — double-check your reasoning.",
          evidence: `High-confidence avg satisfaction: ${highAvgSatisfaction.toFixed(1)}, Low-confidence: ${lowAvgSatisfaction.toFixed(1)}`,
        });
      }
    }

    // Pattern 2: Bias recurrence
    const allBiases = allDecisions
      .filter((d) => d.biasesFlagged && d.biasesFlagged.length > 0)
      .flatMap((d: any) => d.biasesFlagged as string[]);

    const biasCounts = allBiases.reduce((acc: Record<string, number>, bias: string) => {
      acc[bias] = (acc[bias] || 0) + 1;
      return acc;
    }, {});

    for (const [bias, count] of Object.entries(biasCounts)) {
      if ((count as number) >= 2) {
        patterns.push({
          type: "bias_recurrence",
          description: `"${bias}" has been flagged ${count} times across your decisions. This is your most common cognitive blind spot.`,
          confidence: (count as number) >= 3 ? "high" : "medium",
          recommendation: `Be extra vigilant about ${bias}. Before any major decision, ask: "Am I falling into ${bias} right now?"`,
          evidence: `Flagged ${count} times across ${allDecisions.length} decisions`,
        });
      }
    }

    // Pattern 3: "Would choose differently" rate
    const regretful = withOutcomes.filter((d) => d.outcome?.wouldChooseDifferently);
    if (regretful.length >= 2) {
      const regretRate = regretful.length / withOutcomes.length;
      patterns.push({
        type: "regret_rate",
        description: `You'd choose differently on ${(regretRate * 100).toFixed(0)}% of your decisions. ${regretRate > 0.5 ? "This is high — consider slowing down your decision process." : "This is within normal range."}`,
        confidence: withOutcomes.length >= 5 ? "high" : "medium",
        recommendation: regretRate > 0.5
          ? "Your decision process may need more deliberation. Try the 48-hour rule: wait 2 days before finalizing any major decision."
          : "Some regret is normal. Focus on the decisions you stand by — what made those work?",
        evidence: `${regretful.length} of ${withOutcomes.length} decisions had regret`,
      });
    }

    // Pattern 4: Overall satisfaction trend
    if (withOutcomes.length >= 3) {
      const sorted = [...withOutcomes].sort((a: any, b: any) =>
        new Date(a.outcome?.reflectedAt || a.loggedAt).getTime() - new Date(b.outcome?.reflectedAt || b.loggedAt).getTime()
      );
      const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
      const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

      const firstAvg = firstHalf.reduce((sum: number, d: any) => sum + (d.outcome?.satisfaction || 5), 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum: number, d: any) => sum + (d.outcome?.satisfaction || 5), 0) / secondHalf.length;

      if (Math.abs(secondAvg - firstAvg) > 1) {
        patterns.push({
          type: "growth_trajectory",
          description: secondAvg > firstAvg
            ? `Decision quality is improving! Earlier decisions averaged ${firstAvg.toFixed(1)} satisfaction vs. ${secondAvg.toFixed(1)} recently.`
            : `Decision quality has dipped. Earlier decisions averaged ${firstAvg.toFixed(1)} vs. ${secondAvg.toFixed(1)} recently.`,
          confidence: withOutcomes.length >= 5 ? "high" : "low",
          recommendation: secondAvg > firstAvg
            ? "You're learning from experience. Keep logging and reflecting."
            : "Consider whether recent stress or fatigue is affecting your choices. Grounding before decisions may help.",
          evidence: `First half avg: ${firstAvg.toFixed(1)}, Second half avg: ${secondAvg.toFixed(1)}`,
        });
      }
    }

    return {
      patternsFound: patterns,
      totalDecisions: allDecisions.length,
      totalWithOutcomes: withOutcomes.length,
      insufficientData: false,
      message: patterns.length > 0
        ? `Found ${patterns.length} pattern(s) across ${withOutcomes.length} reflected decisions.`
        : "No strong patterns detected yet. Continue logging and reflecting — patterns emerge over time.",
    };
  },
});
