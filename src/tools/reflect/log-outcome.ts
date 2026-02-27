import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getDecisionById, saveOutcome } from "../../db";

export const logOutcome = createTool({
  id: "log_outcome",
  description:
    "Record the actual outcome of a past decision. Closes the reflection loop. Persists to Neon Postgres.",
  inputSchema: z.object({
    decisionId: z.string().describe("The decision ID from log_decision"),
    actualOutcome: z.string().describe("What actually happened"),
    satisfaction: z.number().min(1).max(10).describe("How satisfied are you with the outcome? (1-10)"),
    lessons: z.string().optional().describe("Key lessons learned"),
    wouldChooseDifferently: z.boolean().default(false).describe("Would you make a different choice knowing what you know now?"),
    surpriseFactor: z.enum(["as_expected", "better_than_expected", "worse_than_expected", "completely_unexpected"]).optional(),
  }),
  outputSchema: z.object({
    recorded: z.boolean(),
    decisionTitle: z.string(),
    predictionAccuracy: z.string(),
    reflection: z.string(),
    karmaScoreImpact: z.string(),
  }),
  execute: async (params) => {
    const { decisionId, actualOutcome, satisfaction, lessons, wouldChooseDifferently, surpriseFactor } = params;
    const decision = await getDecisionById(decisionId);

    if (!decision) {
      return {
        recorded: false,
        decisionTitle: "Unknown",
        predictionAccuracy: "N/A",
        reflection: `Decision ${decisionId} not found. It may have been logged in a different session.`,
        karmaScoreImpact: "None",
      };
    }

    // Save outcome
    await saveOutcome(decisionId, {
      actualOutcome,
      satisfaction,
      lessons,
      wouldChooseDifferently,
      surpriseFactor,
      reflectedAt: new Date().toISOString(),
    });

    // Prediction accuracy
    let predictionAccuracy = "No prediction was recorded.";
    if (decision.predictedOutcome) {
      if (surpriseFactor === "as_expected") {
        predictionAccuracy = "Your prediction was accurate — good calibration.";
      } else if (surpriseFactor === "better_than_expected") {
        predictionAccuracy = "The outcome exceeded your prediction. You may be underestimating yourself.";
      } else if (surpriseFactor === "worse_than_expected") {
        predictionAccuracy = "The outcome fell short of your prediction. This is valuable data for future decisions.";
      } else {
        predictionAccuracy = "The outcome was completely unexpected. These surprises teach us the most.";
      }
    }

    // Generate reflection
    let reflection: string;
    if (satisfaction >= 7) {
      reflection = `Great outcome on "${decision.title}". ${lessons ? `Key learning: ${lessons}. ` : ""}This decision process worked — note what you did right for future reference.`;
    } else if (satisfaction >= 4) {
      reflection = `Mixed results on "${decision.title}". ${lessons ? `Learning: ${lessons}. ` : ""}Not every decision leads to a great outcome, but every decision leads to learning.`;
    } else {
      reflection = `Tough outcome on "${decision.title}". ${lessons ? `Hard lesson: ${lessons}. ` : ""}${wouldChooseDifferently ? "You'd choose differently — that clarity is valuable." : "Even in hindsight, you stand by the choice — that says something about your values."}`;
    }

    const karmaImpact = satisfaction >= 7 ? "+3 for positive outcome reflection" :
      satisfaction >= 4 ? "+2 for honest reflection on mixed results" :
      "+2 for courage to reflect on difficult outcomes";

    return {
      recorded: true,
      decisionTitle: decision.title,
      predictionAccuracy,
      reflection,
      karmaScoreImpact: karmaImpact,
    };
  },
});
