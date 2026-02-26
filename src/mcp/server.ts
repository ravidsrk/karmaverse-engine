import { MCPServer } from "@mastra/mcp";
import * as tools from "../tools";
import { wisdomVerses, breathworkExercises, meditationTemplates } from "../data/index";

/**
 * MCP Server — exposes all Karma Engine tools, resources, and prompts
 * via Model Context Protocol.
 *
 * 16 tools, 5 resources, 3 prompts.
 *
 * Usage:
 *   npx @karmaverse/mcp-server
 */
export const mcpServer = new MCPServer({
  name: "karmaverse",
  version: "2.0.0",
  tools: {
    // Ground Layer (Layer 1) — 7 tools
    search_wisdom: tools.searchWisdom,
    get_verse: tools.getVerse,
    get_meditation: tools.getMeditation,
    get_breathing_exercise: tools.getBreathingExercise,
    get_affirmation: tools.getAffirmation,
    mindfulness_check_in: tools.mindfulnessCheckIn,
    verse_of_the_day: tools.verseOfTheDay,

    // Decide Layer (Layer 2) — 4 tools
    create_decision_framework: tools.createDecisionFramework,
    detect_biases: tools.detectBiases,
    log_decision: tools.logDecision,
    get_wisdom_counsel: tools.getWisdomCounsel,

    // Reflect Layer (Layer 3) — 4 tools
    log_outcome: tools.logOutcome,
    detect_patterns: tools.detectPatterns,
    generate_reflection: tools.generateReflection,
    get_pending_reflections: tools.getPendingReflections,

    // Reputation Layer (Layer 4) — 1 tool
    get_karma_score: tools.getKarmaScore,
  },

  // === MCP Resources (5) ===
  resources: {
    listResources: async () => [
      {
        uri: "karmaverse://traditions",
        name: "Available Traditions",
        description: "List of all wisdom traditions available in KarmaVerse",
        mimeType: "application/json",
      },
      {
        uri: "karmaverse://gita/chapters",
        name: "Gita Chapter Index",
        description: "Index of Bhagavad Gita chapters with verse counts and themes",
        mimeType: "application/json",
      },
      {
        uri: "karmaverse://breathwork/catalog",
        name: "Breathwork Exercise Catalog",
        description: "Complete catalog of breathwork exercises with descriptions and difficulty levels",
        mimeType: "application/json",
      },
      {
        uri: "karmaverse://meditation/styles",
        name: "Meditation Style Catalog",
        description: "Available meditation categories, styles, and durations",
        mimeType: "application/json",
      },
    ],
    resourceTemplates: async () => [
      {
        uriTemplate: "karmaverse://gita/verses/{chapter}/{verse}",
        name: "Gita Verse",
        description: "Retrieve a specific Bhagavad Gita verse by chapter and verse number",
        mimeType: "application/json",
      },
    ],
    getResourceContent: async ({ uri }) => {
      if (uri === "karmaverse://traditions") {
        const traditions = ["gita", "stoic", "buddhist", "yoga_sutras"] as const;
        const data = traditions.map((t) => ({
          id: t,
          name: t === "gita" ? "Bhagavad Gita" : t === "stoic" ? "Stoic Philosophy" : t === "buddhist" ? "Buddhist Wisdom" : "Yoga Sutras of Patanjali",
          verseCount: wisdomVerses.filter((v) => v.tradition === t).length,
        }));
        return [{ uri, text: JSON.stringify({ traditions: data, totalVerses: wisdomVerses.length }, null, 2), mimeType: "application/json" }];
      }

      if (uri === "karmaverse://gita/chapters") {
        const chapters = new Map<number, number>();
        for (const v of wisdomVerses.filter((v) => v.tradition === "gita")) {
          const match = v.reference.match(/Chapter (\d+)/);
          if (match) {
            const ch = parseInt(match[1]);
            chapters.set(ch, (chapters.get(ch) || 0) + 1);
          }
        }
        const data = Array.from(chapters.entries()).sort(([a], [b]) => a - b).map(([ch, count]) => ({ chapter: ch, verseCount: count }));
        return [{ uri, text: JSON.stringify({ chapters: data }, null, 2), mimeType: "application/json" }];
      }

      if (uri === "karmaverse://breathwork/catalog") {
        const data = breathworkExercises.map((e) => ({
          slug: e.slug, name: e.name, description: e.description,
          difficulty: e.difficulty, totalDurationSeconds: e.totalDurationSeconds, useCases: e.useCases,
        }));
        return [{ uri, text: JSON.stringify({ exercises: data }, null, 2), mimeType: "application/json" }];
      }

      if (uri === "karmaverse://meditation/styles") {
        const categories = [...new Set(meditationTemplates.map((m) => m.category))];
        const styles = [...new Set(meditationTemplates.map((m) => m.style))];
        return [{ uri, text: JSON.stringify({ categories, styles, totalTemplates: meditationTemplates.length }, null, 2), mimeType: "application/json" }];
      }

      // Handle karmaverse://gita/verses/{chapter}/{verse}
      const verseMatch = uri.match(/^karmaverse:\/\/gita\/verses\/(\d+)\/(\d+)$/);
      if (verseMatch) {
        const [, ch, v] = verseMatch;
        const ref = `${ch}.${v}`;
        const verse = wisdomVerses.find(
          (vr) => vr.tradition === "gita" && (vr.id.includes(ref) || vr.reference.includes(ref))
        );
        if (verse) {
          return [{ uri, text: JSON.stringify(verse, null, 2), mimeType: "application/json" }];
        }
        return [{ uri, text: JSON.stringify({ error: "VERSE_NOT_FOUND", reference: `Gita ${ch}.${v}` }), mimeType: "application/json" }];
      }

      return [{ uri, text: JSON.stringify({ error: "RESOURCE_NOT_FOUND" }), mimeType: "application/json" }];
    },
  },

  // === MCP Prompts (3) ===
  prompts: {
    listPrompts: async () => [
      {
        name: "morning_routine",
        description: "Complete morning practice: verse of the day + intention setting + breathing exercise + affirmation. A 5-minute routine to start the day grounded.",
        arguments: [
          { name: "tradition", description: "Preferred wisdom tradition (gita, stoic, buddhist, yoga_sutras, any)", required: false },
          { name: "mood", description: "Current morning mood", required: false },
        ],
      },
      {
        name: "stress_intervention",
        description: "Immediate stress relief: breathing exercise + grounding verse + short meditation. For when the user is overwhelmed, anxious, or frustrated.",
        arguments: [
          { name: "mood", description: "Current emotional state", required: true },
          { name: "context", description: "What's causing the stress", required: false },
        ],
      },
      {
        name: "evening_reflection",
        description: "End-of-day practice: gratitude reflection + calming verse + wind-down breathing. Helps process the day and prepare for rest.",
        arguments: [
          { name: "highlight", description: "Best moment of the day", required: false },
          { name: "challenge", description: "Biggest challenge faced today", required: false },
        ],
      },
    ],
    getPromptMessages: async ({ name, args }) => {
      if (name === "morning_routine") {
        const tradition = args?.tradition || "any";
        const mood = args?.mood || "hopeful";
        return [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Start my morning routine. I'm feeling ${mood}. Use ${tradition === "any" ? "any" : tradition} tradition.

Please do these in order:
1. Call verse_of_the_day for today's wisdom (tradition: ${tradition})
2. Call get_breathing_exercise for a morning breathwork (use_case: morning)
3. Call get_affirmation for a morning affirmation (category: purpose, mood: ${mood})
4. Present everything as a cohesive 5-minute morning ritual`,
            },
          },
        ];
      }

      if (name === "stress_intervention") {
        const mood = args?.mood || "anxious";
        const context = args?.context || "general stress";
        return [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `I need help right now. I'm feeling ${mood}. Context: ${context}

Please do these immediately:
1. Call get_breathing_exercise (mood: ${mood}) — guide me through a calming breath
2. Call get_verse (mood-matched) — share a grounding wisdom verse
3. Call get_meditation (category: stress_relief, duration: 3) — give me a quick meditation

Keep it concise and calming. I need relief, not a lecture.`,
            },
          },
        ];
      }

      if (name === "evening_reflection") {
        const highlight = args?.highlight || "something good happened";
        const challenge = args?.challenge || "it was a normal day";
        return [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Help me wind down for the evening.

My highlight today: ${highlight}
My challenge today: ${challenge}

Please do these:
1. Call get_verse (tradition: any, mood: grateful) — something to reflect on
2. Call get_breathing_exercise (use_case: relaxation) — wind-down breathing
3. Call get_affirmation (category: gratitude) — an evening affirmation
4. Call get_meditation (category: evening_wind_down, duration: 5) — wind-down meditation

Present as a gentle evening ritual.`,
            },
          },
        ];
      }

      return [{ role: "user" as const, content: { type: "text" as const, text: `Unknown prompt: ${name}` } }];
    },
  },
});
