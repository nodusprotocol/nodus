import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Main build: popup + options (HTML/React entries) and the background service
// worker (ES module). The content script is built separately as an IIFE bundle
// (see vite.content.config.ts) because content scripts cannot use ES imports.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    modulePreload: false,
    rollupOptions: {
      input: {
        popup: "popup.html",
        options: "options.html",
        background: "src/background/index.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
