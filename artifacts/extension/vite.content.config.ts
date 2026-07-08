import { defineConfig } from "vite";

// Content scripts run in the page and cannot use ES module imports, so this
// build emits a single self-contained IIFE bundle appended to the same dist/.
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: { content: "src/content/index.ts" },
      output: {
        format: "iife",
        entryFileNames: "content.js",
        inlineDynamicImports: true,
      },
    },
  },
});
