import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use a relative base so the built app works when served from a sub-path
  // (e.g. GitHub Pages project sites) as well as from the domain root.
  base: "./",
});
