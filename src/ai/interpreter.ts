/**
 * AI Interpreter — Shared personalization layer across all tools.
 *
 * Takes raw content (verse, meditation template, affirmation) + user context
 * and returns a personalized interpretation using Claude.
 *
 * Supports 3 personas: teacher, friend, monk
 *
 * Source: 02-technical-architecture.md §AI Interpreter
 */

import Anthropic from "@anthropic-ai/sdk";

export type Persona = "teacher" | "friend" | "monk";

const personaPrompts: Record<Persona, string> = {
  teacher:
    "You are a wise, scholarly teacher of ancient wisdom. You explain concepts clearly with authority and depth. You connect teachings to practical applications. Your tone is respectful, structured, and educational.",
  friend:
    "You are a warm, relatable friend who happens to know ancient philosophy deeply. You speak casually, use modern examples, and keep it real. Your tone is conversational, encouraging, and down-to-earth. No jargon.",
  monk:
    "You are a contemplative monk who speaks in measured, poetic phrases. You use silence and space in your words. You guide through questions and gentle observations rather than direct instruction. Your tone is serene, minimal, and deeply present.",
};

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  client = new Anthropic({ apiKey });
  return client;
}

/**
 * Personalize a verse interpretation for the user's specific context.
 */
export async function personalizeVerse(params: {
  tradition: string;
  reference: string;
  text: string;
  baseInterpretation: string;
  userContext?: string;
  persona?: Persona;
}): Promise<string> {
  const ai = getClient();
  if (!ai || !params.userContext) return params.baseInterpretation;

  const persona = params.persona || "teacher";
  try {
    const response = await ai.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: `${personaPrompts[persona]}\n\nYou are interpreting a wisdom verse for someone in a specific situation. Keep your interpretation to 2-3 sentences. Connect the verse directly to their situation. Do not repeat the verse text.`,
      messages: [
        {
          role: "user",
          content: `Verse: ${params.reference} from ${params.tradition}\nText: "${params.text}"\nBase interpretation: "${params.baseInterpretation}"\n\nUser's situation: ${params.userContext}\n\nGive a personalized interpretation connecting this verse to their specific situation.`,
        },
      ],
    });
    const block = response.content[0];
    if (block.type === "text") return block.text;
    return params.baseInterpretation;
  } catch {
    return params.baseInterpretation;
  }
}

/**
 * Personalize an affirmation based on user context.
 */
export async function personalizeAffirmation(params: {
  baseText: string;
  category: string;
  userContext?: string;
  tradition?: string;
  persona?: Persona;
}): Promise<string> {
  const ai = getClient();
  if (!ai || !params.userContext) return params.baseText;

  const persona = params.persona || "teacher";
  try {
    const response = await ai.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 150,
      system: `${personaPrompts[persona]}\n\nAdapt the given affirmation for this person's specific situation. Keep it under 2 sentences. Ground it in the ${params.tradition || "wisdom"} tradition's teaching on ${params.category}.`,
      messages: [
        {
          role: "user",
          content: `Base affirmation: "${params.baseText}"\nCategory: ${params.category}\nUser's situation: ${params.userContext}\n\nAdapt this affirmation to their situation:`,
        },
      ],
    });
    const block = response.content[0];
    if (block.type === "text") return block.text;
    return params.baseText;
  } catch {
    return params.baseText;
  }
}

/**
 * Generate a personalized meditation script from a template.
 */
export async function personalizeMeditation(params: {
  templateScript: string;
  category: string;
  durationMinutes: number;
  mood?: string;
  userContext?: string;
  timeOfDay?: string;
  persona?: Persona;
}): Promise<{
  intro: { text: string; durationSeconds: number };
  body: Array<{ phase: string; text: string; durationSeconds: number }>;
  closing: { text: string; durationSeconds: number };
}> {
  const ai = getClient();
  const totalSeconds = params.durationMinutes * 60;
  const introSeconds = Math.min(30, totalSeconds * 0.1);
  const closingSeconds = Math.min(30, totalSeconds * 0.1);
  const bodySeconds = totalSeconds - introSeconds - closingSeconds;

  // Default structured response
  const defaultResult = {
    intro: {
      text: "Find a comfortable position and gently close your eyes. Take a deep breath in... and slowly release it out.",
      durationSeconds: Math.round(introSeconds),
    },
    body: [
      {
        phase: "settling",
        text: "Allow your breath to find its natural rhythm. Notice the weight of your body against the surface beneath you.",
        durationSeconds: Math.round(bodySeconds * 0.2),
      },
      {
        phase: "core",
        text: params.templateScript,
        durationSeconds: Math.round(bodySeconds * 0.6),
      },
      {
        phase: "deepening",
        text: "Rest in this awareness. There is nothing to fix, nothing to change. Simply be present with what is.",
        durationSeconds: Math.round(bodySeconds * 0.2),
      },
    ],
    closing: {
      text: "When you're ready, gently wiggle your fingers and toes. Take one more deep breath. Open your eyes slowly, carrying this calm with you.",
      durationSeconds: Math.round(closingSeconds),
    },
  };

  if (!ai || (!params.mood && !params.userContext)) return defaultResult;

  try {
    const persona = params.persona || "teacher";
    const timeContext = params.timeOfDay ? ` It's ${params.timeOfDay}.` : "";
    const moodContext = params.mood ? ` The user feels ${params.mood}.` : "";
    const userCtx = params.userContext ? ` Their situation: ${params.userContext}` : "";

    const response = await ai.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: `${personaPrompts[persona]}\n\nGenerate a guided meditation script in JSON format. The meditation is ${params.durationMinutes} minutes (${params.category} style).${timeContext}${moodContext}${userCtx}\n\nReturn ONLY valid JSON with this structure:\n{"intro":{"text":"...","durationSeconds":${Math.round(introSeconds)}},"body":[{"phase":"settling","text":"...","durationSeconds":${Math.round(bodySeconds * 0.2)}},{"phase":"core","text":"...","durationSeconds":${Math.round(bodySeconds * 0.6)}},{"phase":"deepening","text":"...","durationSeconds":${Math.round(bodySeconds * 0.2)}}],"closing":{"text":"...","durationSeconds":${Math.round(closingSeconds)}}}`,
      messages: [
        {
          role: "user",
          content: `Generate a ${params.durationMinutes}-minute ${params.category} meditation. Base template: "${params.templateScript.slice(0, 200)}..."`,
        },
      ],
    });
    const block = response.content[0];
    if (block.type === "text") {
      const jsonMatch = block.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.intro && parsed.body && parsed.closing) return parsed;
      }
    }
    return defaultResult;
  } catch {
    return defaultResult;
  }
}

/**
 * Check if AI personalization is available.
 */
export function isAiAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
