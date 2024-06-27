import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adding an alis to the vite config for danfojs
  resolve: {
    alias: {
      danfojs: "danfojs/dist/danfojs-browser/src/index.js", // Ajusta según sea necesario
    },
  },
});
