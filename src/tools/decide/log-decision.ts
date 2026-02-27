import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { randomUUID } from "crypto";
import { createDecision, getMemoryStore } from "../../db";

/**
 * @deprecated Use getMemoryStore() from db module instead.
 * Kept for backward compatibility with tests that import this directly.
 */
export const getDecisionStore = () => getMemoryStore();

export const logDecision = createTool({
  id: "log_decision",
  description:
    "Log a decision for future reflection. Stores to Neon Postgres (or in-memory fallback). Returns a decision ID for tracking.",
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

    await createDecision({
      id: decisionId,
      userId,
      title,
      context: decisionContext,
      options,
      chosenOption,
      reasoning,
      predictedOutcome,
      confidenceLevel,
      biasesFlagged,
      reviewDate,
      loggedAt,
    });

    return {
      decisionId,
      title,
      loggedAt,
      reviewDate,
      message: `Decision logged. I'll remind you to reflect on this in ${reviewAfterDays} days (${reviewDate}). Your future self will thank you for tracking this.`,
    };
  },
});
