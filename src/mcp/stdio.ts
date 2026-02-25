#!/usr/bin/env node
/**
 * MCP Server entry point — stdio transport.
 *
 * This is the binary that runs when an agent connects via:
 *   npx @karmaverse/mcp-server
 */
import { mcpServer } from "./server";

mcpServer.startStdio().catch((err: Error) => {
  console.error("Failed to start KarmaVerse MCP server:", err.message);
  process.exit(1);
});
