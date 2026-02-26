import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { wisdomVerses } from "../../data/index";
import { cognitiveBiases } from "../../data/index";

export const createDecisionFramework = createTool({
  id: "create_decision_framework",
  description:
    "Generate a structured multi-lens decision framework. Analyzes a decision through values alignment, fear vs. growth, regret minimization, and reversibility. Includes bias detection and cross-tradition wisdom counsel.",
  inputSchema: z.object({
    decision: z.string().describe("The decision being considered"),
    options: z.array(z.string()).min(2).max(5).describe("Available options"),
    context: z.string().optional().describe("Background context for the decision"),
    userValues: z.array(z.string()).optional().describe("User's stated values (e.g., ['growth', 'family', 'stability'])"),
    urgency: z.enum(["immediate", "days", "weeks", "months"]).default("weeks").describe("How urgent is the decision"),
  }),
  outputSchema: z.object({
    decision: z.string(),
    framework: z.object({
      valuesAlignment: z.object({
        analysis: z.string(),
        bestOption: z.string(),
      }),
      fearVsGrowth: z.object({
        analysis: z.string(),
        fearOption: z.string(),
        growthOption: z.string(),
      }),
      regretMinimization: z.object({
        analysis: z.string(),
        leastRegretOption: z.string(),
      }),
      reversibility: z.object({
        analysis: z.string(),
        reversibleOptions: z.array(z.string()),
        irreversibleOptions: z.array(z.string()),
      }),
    }),
    biasesDetected: z.array(
      z.object({
        bias: z.string(),
        signal: z.string(),
        debiasingSuggestion: z.string(),
      })
    ),
    wisdomCounsel: z.array(
      z.object({
        tradition: z.string(),
        reference: z.string(),
        insight: z.string(),
      })
    ),
    recommendation: z.string(),
    nextStep: z.string(),
  }),
  execute: async (input) => {
    const { decision, options, context, userValues, urgency } = input;
    const decisionLower = decision.toLowerCase();
    const contextLower = (context || "").toLowerCase();
    const combined = `${decisionLower} ${contextLower}`;

    // === VALUES ALIGNMENT ===
    const values = userValues || ["growth", "wellbeing", "authenticity"];
    const valuesAnalysis = `Evaluating against your values: ${values.join(", ")}. Consider which option best serves these values — not just in the short term, but as a pattern for who you want to become.`;

    // === FEAR VS GROWTH ===
    // Simple heuristic: options with "stay/keep/don't" tend to be fear-based
    const fearKeywords = ["stay", "keep", "don't", "not", "avoid", "safe", "same"];
    const growthKeywords = ["change", "new", "start", "try", "build", "create", "move"];

    let fearOption = options[0];
    let growthOption = options[options.length - 1];
    for (const opt of options) {
      const optLower = opt.toLowerCase();
      if (fearKeywords.some((k) => optLower.includes(k))) fearOption = opt;
      if (growthKeywords.some((k) => optLower.includes(k))) growthOption = opt;
    }

    // === REVERSIBILITY ===
    const irreversibleKeywords = ["quit", "sell", "end", "divorce", "move country", "surgery"];
    const reversibleOptions = options.filter(
      (o) => !irreversibleKeywords.some((k) => o.toLowerCase().includes(k))
    );
    const irreversibleOptions = options.filter((o) =>
      irreversibleKeywords.some((k) => o.toLowerCase().includes(k))
    );

    // === BIAS DETECTION ===
    const detectedBiases: { bias: string; signal: string; debiasingSuggestion: string }[] = [];
    for (const bias of cognitiveBiases) {
      for (const pattern of bias.signalPatterns) {
        if (combined.includes(pattern.toLowerCase())) {
          detectedBiases.push({
            bias: bias.name,
            signal: `Detected signal: "${pattern}"`,
            debiasingSuggestion: bias.debiasingStrategy,
          });
          break;
        }
      }
    }

    // Check for common implicit biases
    if (combined.includes("everyone") || combined.includes("all my friends")) {
      const bandwagon = cognitiveBiases.find((b) => b.id === "bandwagon")!;
      if (!detectedBiases.find((d) => d.bias === bandwagon.name)) {
        detectedBiases.push({
          bias: bandwagon.name,
          signal: "Referenced what others are doing as justification",
          debiasingSuggestion: bandwagon.debiasingStrategy,
        });
      }
    }

    if (urgency === "immediate" && combined.includes("just")) {
      const recency = cognitiveBiases.find((b) => b.id === "recency")!;
      if (!detectedBiases.find((d) => d.bias === recency.name)) {
        detectedBiases.push({
          bias: recency.name,
          signal: "Urgent decision may be influenced by very recent events",
          debiasingSuggestion: recency.debiasingStrategy,
        });
      }
    }

    // === WISDOM COUNSEL ===
    const relevantThemes = ["control", "duty", "non-attachment", "impermanence", "clarity", "action"];
    const counsel = wisdomVerses
      .filter((v) => v.themes.some((t) => relevantThemes.includes(t)))
      .slice(0, 3)
      .map((v) => ({
        tradition: v.tradition,
        reference: v.reference,
        insight: v.interpretation,
      }));

    // === RECOMMENDATION ===
    const rec =
      urgency === "immediate"
        ? `This feels urgent, but if possible, sleep on it. ${detectedBiases.length > 0 ? `${detectedBiases.length} bias(es) detected — pause before deciding.` : ""} Immediate decisions during stress tend to underperform.`
        : `You have time (${urgency}). Use it. Gather perspectives, test assumptions, and revisit this framework in a few days with fresh eyes.`;

    return {
      decision,
      framework: {
        valuesAlignment: {
          analysis: valuesAnalysis,
          bestOption: options[0], // Would be LLM-determined in full version
        },
        fearVsGrowth: {
          analysis: `Which option is driven by fear (avoiding loss) vs. growth (pursuing gain)? Fear-based decisions feel safe but often lead to stagnation. Growth-based decisions feel risky but build the life you actually want.`,
          fearOption,
          growthOption,
        },
        regretMinimization: {
          analysis: `Imagine yourself at 80, looking back. Which choice would you regret NOT making? The Bezos regret minimization framework: minimize regret, not risk.`,
          leastRegretOption: growthOption,
        },
        reversibility: {
          analysis:
            reversibleOptions.length > 0
              ? `${reversibleOptions.length} option(s) are reversible — you can try and adjust. Irreversible decisions deserve more deliberation.`
              : "All options appear significant. Give each careful consideration.",
          reversibleOptions,
          irreversibleOptions,
        },
      },
      biasesDetected: detectedBiases,
      wisdomCounsel: counsel,
      recommendation: rec,
      nextStep:
        detectedBiases.length > 0
          ? "Address the detected biases first. Then revisit the framework with clearer reasoning."
          : "Sit with this framework. Discuss with someone you trust. Log your decision when ready.",
    };
  },
});
