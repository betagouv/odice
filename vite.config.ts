import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { readFileSync } from "fs";

// Source unique de version : le package.json du projet
const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, "./package.json"), "utf-8"),
) as { version: string };

export default defineConfig({
  plugins: [react()],
  // Injecté au build pour afficher la version sans appel réseau
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  css: {
    lightningcss: { errorRecovery: true },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@engine": path.resolve(__dirname, "./src/engine"),
    },
  },
  server: {
    port: 5173,
  },
});
