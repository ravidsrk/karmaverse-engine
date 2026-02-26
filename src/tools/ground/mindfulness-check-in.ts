import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { wisdomVerses, breathworkExercises, affirmations } from "../../data/index";

export const mindfulnessCheckIn = createTool({
  id: "mindfulness_check_in",
  description:
    "Complete mindfulness assessment and grounding session. Based on mood and energy, returns a personalized breathing exercise, relevant wisdom verse, and grounding affirmation — all in one call.",
  inputSchema: z.object({
    mood: z
      .enum(["anxious", "sad", "angry", "confused", "restless", "grateful", "hopeful", "peaceful", "overwhelmed", "lonely", "frustrated"])
      .describe("Current emotional state"),
    energy: z.enum(["very_low", "low", "medium", "high", "very_high"]).describe("Current energy level"),
    context: z.string().optional().describe("Brief description of the situation (e.g., 'deadline pressure', 'relationship conflict')"),
    timeAvailableMinutes: z.number().min(1).max(30).default(5).optional().describe("How many minutes the user has for grounding"),
  }),
  outputSchema: z.object({
    assessment: z.string(),
    breathing: z.object({
      name: z.string(),
      description: z.string(),
      steps: z.array(
        z.object({
          instruction: z.string(),
          durationSeconds: z.number(),
          phase: z.string(),
        })
      ),
      whyThisOne: z.string(),
    }),
    wisdom: z.object({
      tradition: z.string(),
      source: z.string(),
      reference: z.string(),
      text: z.string(),
      interpretation: z.string(),
    }),
    grounding: z.object({
      affirmation: z.string(),
      category: z.string(),
    }),
    followUp: z.string(),
  }),
  execute: async (params) => {
    const { mood, energy, context: userContext, timeAvailableMinutes } = params;
    const availableTime = timeAvailableMinutes || 5;

    // Generate assessment
    const assessments: Record<string, string> = {
      anxious: "You're experiencing anxiety — your mind is running ahead of the present moment. Let's bring you back.",
      sad: "You're feeling sadness. That's valid. Let's create some space for it without being consumed by it.",
      angry: "You're feeling anger. It's energy looking for direction. Let's channel it constructively.",
      confused: "You're feeling confused — too many inputs, not enough clarity. Let's simplify.",
      restless: "You're feeling restless — energy without a target. Let's ground that energy.",
      grateful: "You're feeling grateful. Let's deepen that and carry it forward.",
      hopeful: "You're feeling hopeful. That's powerful. Let's anchor this feeling so you can draw on it later.",
      peaceful: "You're in a peaceful state. Let's deepen this with intentional practice.",
      overwhelmed: "You're overwhelmed — too much, too fast. Let's slow down and take one thing at a time.",
      lonely: "You're feeling lonely. Connection starts within. Let's start there.",
      frustrated: "You're frustrated — expectations and reality aren't matching. Let's work with what's real.",
    };

    // Pick breathing exercise
    const negativeMoods = ["anxious", "sad", "angry", "overwhelmed", "frustrated", "lonely", "restless", "confused"];
    let exercise;
    if (energy === "very_low" || energy === "low") {
      exercise = breathworkExercises.find((e) => e.slug === "belly-breathing")!;
    } else if (negativeMoods.includes(mood) && (energy === "high" || energy === "very_high")) {
      exercise = breathworkExercises.find((e) => e.slug === "box-breathing")!;
    } else if (mood === "restless") {
      exercise = breathworkExercises.find((e) => e.slug === "coherent-breathing")!;
    } else {
      exercise = breathworkExercises.find((e) => e.moodTags.includes(mood)) || breathworkExercises[0];
    }

    // Pick wisdom verse
    const matchedVerses = wisdomVerses.filter((v) => v.moodTags.includes(mood));
    const verse = matchedVerses[Math.floor(Math.random() * matchedVerses.length)] || wisdomVerses[0];

    // Pick affirmation
    const matchedAffirmations = affirmations.filter((a) => a.moodTags.includes(mood));
    const affirmation = matchedAffirmations[Math.floor(Math.random() * matchedAffirmations.length)] || affirmations[0];

    // Follow-up suggestion
    const followUps: Record<string, string> = {
      anxious: "After the breathing exercise, consider a 3-minute focus meditation to channel your energy into one task.",
      sad: "After grounding, try a gratitude meditation — it gently shifts perspective without denying the sadness.",
      angry: "After breathing, write down what triggered this. Separate the event from your interpretation of it.",
      confused: "After grounding, try the decision framework tool — it structures your thinking when clarity is elusive.",
      restless: "After breathing, choose ONE thing to focus on for the next 30 minutes. Just one.",
      overwhelmed: "After the breathing exercise, list 3 things you can control right now. Ignore everything else for the next hour.",
      frustrated: "After grounding, revisit your expectations. Are they realistic? What can you actually change?",
      lonely: "After breathing, reach out to one person today — even a brief message. Connection is a practice, not a feeling.",
      grateful: "Deepen this feeling with a 3-minute gratitude meditation while you're in this state.",
      hopeful: "Capture this feeling — write down what's fueling your hope. You can return to this note on harder days.",
      peaceful: "Use this calm state for a 5-minute intention-setting meditation. Peaceful moments are the best time to plan.",
    };

    return {
      assessment: assessments[mood] || "Let's take a moment to ground ourselves.",
      breathing: {
        name: exercise.name,
        description: exercise.description,
        steps: exercise.steps,
        whyThisOne:
          energy === "low"
            ? "Gentle diaphragmatic breathing — low energy needs nurturing, not stimulation."
            : energy === "high"
              ? "Structured breathing to channel high energy into calm focus."
              : `Selected for your current state (${mood}).`,
      },
      wisdom: {
        tradition: verse.tradition,
        source: verse.source,
        reference: verse.reference,
        text: verse.text,
        interpretation: userContext
          ? `${verse.interpretation} — especially relevant to your situation: ${userContext}.`
          : verse.interpretation,
      },
      grounding: {
        affirmation: affirmation.text,
        category: affirmation.category,
      },
      followUp: availableTime <= 2
        ? "That's all we need for now. Just the breathing is enough. Return to what you were doing."
        : availableTime <= 5
          ? (followUps[mood] || "Consider a brief meditation to deepen this grounding.")
          : `You have ${availableTime} minutes. ${followUps[mood] || "Try a full meditation session to deepen this grounding."} You have time for a ${Math.min(availableTime - 2, 10)}-minute meditation after the breathing exercise.`,
    };
  },
});
