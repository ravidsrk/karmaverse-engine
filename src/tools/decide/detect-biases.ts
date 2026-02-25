import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { cognitiveBiases } from "../../data/biases";

export const detectBiases = createTool({
  id: "detect_biases",
  description:
    "Analyze reasoning text for cognitive biases. Scans for 12 common biases (sunk cost, confirmation, anchoring, loss aversion, etc.) and returns specific de-biasing strategies with wisdom tradition connections.",
  inputSchema: z.object({
    reasoning: z.string().describe("The user's reasoning or thought process to analyze for biases"),
    decisionContext: z.string().optional().describe("What decision this reasoning is about"),
  }),
  outputSchema: z.object({
    biasesFound: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        matchedSignal: z.string(),
        debiasingStrategy: z.string(),
        wisdomConnection: z.object({
          tradition: z.string(),
          reference: z.string(),
          insight: z.string(),
        }),
        severity: z.enum(["low", "medium", "high"]),
      })
    ),
    overallAssessment: z.string(),
    reasoningQuality: z.enum(["clear", "some_biases", "heavily_biased"]),
    suggestion: z.string(),
  }),
  execute: async (params) => {
    const { reasoning, decisionContext } = params;
    const text = `${reasoning} ${decisionContext || ""}`.toLowerCase();

    const found: Array<{
      name: string;
      description: string;
      matchedSignal: string;
      debiasingStrategy: string;
      wisdomConnection: { tradition: string; reference: string; insight: string };
      severity: "low" | "medium" | "high";
    }> = [];

    for (const bias of cognitiveBiases) {
      const matchedPatterns: string[] = [];
      for (const pattern of bias.signalPatterns) {
        if (text.includes(pattern.toLowerCase())) {
          matchedPatterns.push(pattern);
        }
      }

      if (matchedPatterns.length > 0) {
        found.push({
          name: bias.name,
          description: bias.description,
          matchedSignal: `Detected: "${matchedPatterns[0]}"${matchedPatterns.length > 1 ? ` (+${matchedPatterns.length - 1} more signals)` : ""}`,
          debiasingStrategy: bias.debiasingStrategy,
          wisdomConnection: bias.wisdomConnection,
          severity: matchedPatterns.length >= 3 ? "high" : matchedPatterns.length >= 2 ? "medium" : "low",
        });
      }
    }

    // Assess overall quality
    let reasoningQuality: "clear" | "some_biases" | "heavily_biased";
    let overallAssessment: string;
    let suggestion: string;

    if (found.length === 0) {
      reasoningQuality = "clear";
      overallAssessment = "No obvious cognitive biases detected in your reasoning. This doesn't mean there are none — only that common patterns weren't found. Consider seeking an outside perspective to catch blind spots.";
      suggestion = "Your reasoning appears clear. Proceed with confidence, but document your decision for future reflection.";
    } else if (found.length <= 2) {
      reasoningQuality = "some_biases";
      overallAssessment = `${found.length} potential bias(es) detected. This is normal — everyone has biases. The key is awareness. Review each one and apply the de-biasing strategies before deciding.`;
      suggestion = "Address each bias using the suggested strategies. Then re-evaluate your options with fresh eyes.";
    } else {
      reasoningQuality = "heavily_biased";
      overallAssessment = `${found.length} biases detected — your reasoning may be significantly influenced by cognitive shortcuts. This is not a judgment — it's information. Consider delaying this decision until you've addressed these biases.`;
      suggestion = "Strongly recommend: (1) Write down your reasoning again from scratch. (2) Discuss with someone who disagrees with your current leaning. (3) Sleep on it before deciding.";
    }

    return {
      biasesFound: found,
      overallAssessment,
      reasoningQuality,
      suggestion,
    };
  },
});
