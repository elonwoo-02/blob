import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: [
      "test/**/*.test.ts",
      "test/**/*.test.tsx",
      "src/test/**/*.test.ts",
      "src/test/**/*.test.tsx",
    ],
    passWithNoTests: true,
  },
});

