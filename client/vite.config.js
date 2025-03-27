import { fileURLToPath, URL } from "node:url";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import child_process from "child_process";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
