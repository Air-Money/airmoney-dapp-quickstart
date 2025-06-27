import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "./assets",
          dest: "./",
        },
        {
          src: "./metadata.json",
          dest: "./",
        },
        {
          src: "./dapp-logo.png",
          dest: "./",
        },
      ],
    }),
  ],
  build: {
    copyPublicDir: false,
  },
  publicDir: "assets",
});
