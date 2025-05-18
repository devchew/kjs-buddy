import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectRegister: "auto",

      // Better version handling
      includeAssets: ["favicon.ico", "robots.txt", "version.json"],

      pwaAssets: {
        disabled: true,
      },

      manifest: false,

      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        // Add build timestamp to ensure cache busting on new deployments
        additionalManifestEntries: [
          { url: "version.json", revision: `${Date.now()}` },
        ],
        // Make sure version.json is always fetched from network
        dontCacheBustURLsMatching: /^(?!.*version\.json)/,
      }, // Workbox configuration
      workbox: {
        // Always try network first to ensure fresh content
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes("version.json"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60, // 1 minute max age for version file
              },
            },
          },
        ],
        // Don't precache version.json
        globIgnores: ["**/version.json"],
      },

      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  server: {
    port: 7777,
  },
  base: "/",
});
