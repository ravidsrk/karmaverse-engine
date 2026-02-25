#!/usr/bin/env node
/**
 * Start the REST API server.
 * Usage: npx tsx src/api/start.ts
 */
import { serve } from "@hono/node-server";
import { app } from "./server.js";

const port = parseInt(process.env.PORT || "3737");

console.log(`\n🧘 KarmaVerse Karma Engine API`);
console.log(`   http://localhost:${port}`);
console.log(`   http://localhost:${port}/api/v2/verse-of-day`);
console.log(`\n   15 tools × 3 layers × 4 traditions\n`);

serve({
  fetch: app.fetch,
  port,
});
