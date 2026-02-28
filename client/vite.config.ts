import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "Habit Tracker",
        short_name: "Habits",
        description: "Track your daily habits",
        theme_color: "#09090b",
        background_color: "#09090b",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icons/manifest-icon-192.maskable.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/manifest-icon-192.maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icons/manifest-icon-512.maskable.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/manifest-icon-512.maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: "NetworkFirst",
            options: { cacheName: "api-cache", networkTimeoutSeconds: 5 },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5175,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
