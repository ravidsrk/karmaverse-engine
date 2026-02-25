import { MCPServer } from "@mastra/mcp";
import * as tools from "../tools";

/**
 * MCP Server — exposes all Karma Engine tools via Model Context Protocol.
 *
 * This is the PRIMARY distribution channel.
 * Any Claude, OpenClaw, or Cursor agent can connect to this server.
 *
 * Usage:
 *   npx @karmaverse/mcp-server
 *
 * Or add to MCP config:
 *   { "mcpServers": { "karmaverse": { "command": "npx", "args": ["@karmaverse/mcp-server"] } } }
 */
export const mcpServer = new MCPServer({
  name: "karmaverse",
  version: "1.0.0",
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
  },
});
