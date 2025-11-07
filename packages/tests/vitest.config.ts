import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./setup.ts"],
    include: ["**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["node_modules/**/*"],
    fileParallelism: false, // Run test files sequentially to avoid database conflicts
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/**", "**/*.d.ts", "**/*.config.{js,ts}"],
    },
  },
});
