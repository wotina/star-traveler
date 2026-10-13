import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages hosts this project beneath the repository name. Keep the
  // local preview at / so the same app remains easy to run during development.
  base: process.env.GITHUB_ACTIONS === "true" ? "/star-traveler/" : "/",
});
