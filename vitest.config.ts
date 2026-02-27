import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      // Force in-memory fallback in tests — no Prisma/Neon
      DATABASE_URL: "",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json-summary", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/test.ts",
        "src/**/*.test.ts",
        "src/**/index.ts",
        "src/mcp/stdio.ts",
        "src/api/start.ts",
      ],
    },
  },
});
