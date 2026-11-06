import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      // Setiap request yang dimulai dengan "/api" akan diteruskan ke Django
      "/api": {
        target: "http://127.0.0.1:8000", // Pastikan port ini sesuai dengan port runserver Django kamu
        changeOrigin: true,
        secure: false,
      },
    },
  },
});