import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      "/website-content.json": {
        target: "https://www.meemcurtain.co.za",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
