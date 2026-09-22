import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const LAYERS = ["app", "widgets", "pages", "features", "entities", "shared"];

const SRC = fileURLToPath(new URL("./src/", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: LAYERS.map((layer) => ({
      find: new RegExp(`^${layer}/`),
      replacement: `${SRC}${layer}/`,
    })),
  },
});
