/**
 * KarmaVerse Engine — The Karma Engine for AI Agents
 *
 * Action → Consequence → Reflection → Growth
 *
 * 15 tools across 3 layers:
 * - Ground (7): Mindfulness, breathwork, meditation, wisdom, affirmations
 * - Decide (4): Decision frameworks, bias detection, wisdom counsel
 * - Reflect (4): Outcome tracking, pattern detection, reflections
 *
 * Distribution: MCP Server (primary), REST API + x402, Mastra agents
 */

// Core Mastra instance
export { mastra } from "./mastra";

// All tools
export * from "./tools";

// All agents
export * from "./agents";

// MCP Server
export { mcpServer } from "./mcp/server";

// Data (for direct access)
export { wisdomVerses, breathworkExercises, affirmations, meditationTemplates } from "./data/wisdom";
export { cognitiveBiases } from "./data/biases";
