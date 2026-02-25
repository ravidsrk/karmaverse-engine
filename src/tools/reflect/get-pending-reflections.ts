import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getDecisionStore } from "../decide/log-decision";

export const getPendingReflections = createTool({
  id: "get_pending_reflections",
  description:
    "List decisions that are due for outcome reflection. Returns decisions where the review date has passed and no outcome has been logged yet.",
  inputSchema: z.object({
    userId: z.string().default("default").describe("User identifier"),
  }),
  outputSchema: z.object({
    pending: z.array(
      z.object({
        decisionId: z.string(),
        title: z.string(),
        chosenOption: z.string(),
        decidedAt: z.string(),
        reviewDate: z.string(),
        daysOverdue: z.number(),
        predictedOutcome: z.string().nullable(),
        prompt: z.string(),
      })
    ),
    totalPending: z.number(),
    message: z.string(),
  }),
  execute: async (params) => {
    const { userId } = params;
    const store = getDecisionStore();
    const now = new Date();

    const allDecisions = Array.from(store.values()).filter((d) => d.userId === userId);

    const pending = allDecisions
      .filter((d) => {
        if (d.outcome) return false; // Already reflected
        const reviewDate = new Date(d.reviewDate);
        return reviewDate <= now;
      })
      .map((d) => {
        const reviewDate = new Date(d.reviewDate);
        const daysOverdue = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          decisionId: d.decisionId,
          title: d.title,
          chosenOption: d.chosenOption,
          decidedAt: d.loggedAt,
          reviewDate: d.reviewDate,
          daysOverdue,
          predictedOutcome: d.predictedOutcome || null,
          prompt: `You decided to "${d.chosenOption}" regarding "${d.title}" on ${new Date(d.loggedAt).toLocaleDateString()}. How did it turn out?`,
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    const upcomingCount = allDecisions.filter((d) => !d.outcome && new Date(d.reviewDate) > now).length;

    return {
      pending,
      totalPending: pending.length,
      message:
        pending.length === 0
          ? upcomingCount > 0
            ? `No reflections due right now. ${upcomingCount} decision(s) will be ready for review soon.`
            : "No pending reflections. Log some decisions and they'll appear here when it's time to reflect."
          : `${pending.length} decision(s) ready for reflection. The oldest is ${pending[0].daysOverdue} day(s) overdue.`,
    };
  },
});
