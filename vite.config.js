import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  // GitHub Pages hosts this project beneath the repository name. Keep the
  // local preview at / so the same app remains easy to run during development.
  base: process.env.GITHUB_ACTIONS === "true" ? "/star-traveler/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
        gameBasedLearning: resolve(projectRoot, "game-based-learning.html"),
        oceanMemory: resolve(projectRoot, "ocean-memory.html"),
        mechanismGame: resolve(projectRoot, "mechanism-game.html"),
      },
    },
  },
});
