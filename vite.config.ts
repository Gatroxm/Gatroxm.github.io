import { defineConfig } from "vite";
import { injectClassicContent } from "./plugins/static-content";

export default defineConfig({
  base: "/",
  plugins: [injectClassicContent()],
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
});
