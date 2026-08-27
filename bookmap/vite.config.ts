import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import yaml from "@rollup/plugin-yaml";

// The book map SPA — the owner's content-review app. Run with `pnpm bookmap`.
//
// It imports the main app's content modules through the same `@` alias, so it
// renders exactly what the app ships (validated, Hana-filtered) and can never
// go stale against src/content/ — new lessons, chapters and books appear the
// moment the app's own modules carry them.
export default defineConfig({
  plugins: [react(), yaml()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
    },
    dedupe: ["react", "react-dom"],
  },
});
