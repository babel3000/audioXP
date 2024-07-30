// vite.config.js

import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./lib/audio-xp.js"),
      name: "audioXP",
      fileName: (format) => `audio-xp.${format}.js`,
    },
  },
});