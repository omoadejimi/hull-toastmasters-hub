import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({ server: { entry: "server" } }),
    nitro({ output: { dir: "dist", publicDir: "dist", serverDir: "dist/server" } }),
    react(),
  ],
  resolve: { tsconfigPaths: true, dedupe: ["react", "react-dom", "@tanstack/react-router"] },
});
