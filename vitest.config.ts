import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Next.js resolves "server-only" itself; under node it is a no-op.
      "server-only": path.resolve(__dirname, "test/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    // @/db builds a (lazy, never-connected) Pool at import time and requires
    // DATABASE_URL to be present — a placeholder keeps the import safe.
    env: {
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    },
    include: ["src/**/*.test.ts"],
  },
});
