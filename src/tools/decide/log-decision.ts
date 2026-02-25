import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { randomUUID } from "crypto";

// In-memory store for now — will be replaced by Supabase/LibSQL
const decisionStore: Map<string, any> = new Map();

export const getDecisionStore = () => decisionStore;

export const logDecision = createTool({
  id: "log_decision",
  description:
    "Log a decision for future reflection. Stores the decision context, options, chosen option, reasoning, and predicted outcome. Returns a decision ID for tracking.",
  inputSchema: z.object({
    userId: z.string().default("default").describe("User identifier"),
    title: z.string().describe("Brief title of the decision"),
    context: z.string().optional().describe("Background context"),
    options: z.array(z.string()).optional().describe("Options that were considered"),
    chosenOption: z.string().describe("The option that was chosen"),
    reasoning: z.string().optional().describe("Why this option was chosen"),
    predictedOutcome: z.string().optional().describe("What the user expects to happen"),
    confidenceLevel: z.number().min(1).max(10).optional().describe("Confidence in the decision (1-10)"),
    biasesFlagged: z.array(z.string()).optional().describe("Any biases that were flagged"),
    reviewAfterDays: z.number().default(30).describe("Days until reflection reminder"),
  }),
  outputSchema: z.object({
    decisionId: z.string(),
    title: z.string(),
    loggedAt: z.string(),
    reviewDate: z.string(),
    message: z.string(),
  }),
  execute: async (params) => {
    const {
      userId,
      title,
      context: decisionContext,
      options,
      chosenOption,
      reasoning,
      predictedOutcome,
      confidenceLevel,
      biasesFlagged,
      reviewAfterDays,
    } = params;

    const decisionId = `dec_${randomUUID().slice(0, 12)}`;
    const loggedAt = new Date().toISOString();
    const reviewDate = new Date(Date.now() + reviewAfterDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const decision = {
      decisionId,
      userId,
      title,
      context: decisionContext,
      options,
      chosenOption,
      reasoning,
      predictedOutcome,
      confidenceLevel,
      biasesFlagged,
      reviewAfterDays,
      loggedAt,
      reviewDate,
      outcome: null, // Filled later by log_outcome
    };

    decisionStore.set(decisionId, decision);

    return {
      decisionId,
      title,
      loggedAt,
      reviewDate,
      message: `Decision logged. I'll remind you to reflect on this in ${reviewAfterDays} days (${reviewDate}). Your future self will thank you for tracking this.`,
    };
  },
});
