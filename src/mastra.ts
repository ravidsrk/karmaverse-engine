import { Mastra } from "@mastra/core";
import { groundAgent, decideAgent, reflectAgent, karmaEngineAgent } from "./agents";

/**
 * Main Mastra instance — the Karma Engine.
 *
 * Registers all agents and makes them available via MCP and REST.
 */
export const mastra = new Mastra({
  agents: {
    groundAgent,
    decideAgent,
    reflectAgent,
    karmaEngineAgent,
  },
});
