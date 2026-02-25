import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/mcp/stdio.ts",
    "src/mcp/server.ts",
    "src/tools/index.ts",
    "src/agents/index.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node22",
  outDir: "dist",
  splitting: false,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
