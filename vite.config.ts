import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  // Relative asset paths work identically on GitHub Pages subpaths (/Arvostra/),
  // custom domains (arvostra.com), Netlify, and local static previews.
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        feedback: resolve(__dirname, "feedback.html"),
      },
    },
  },
});
