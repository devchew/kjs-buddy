// vite.config.ts
import { defineConfig } from "file:///C:/Users/Infin/Documents/git/kjs-buddy/node_modules/.pnpm/vite@5.4.18_@types+node@22.15.2_terser@5.39.0/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Infin/Documents/git/kjs-buddy/node_modules/.pnpm/@vitejs+plugin-react@4.4.1__1f0e437277b47d37402ad57388ef2b6c/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/Infin/Documents/git/kjs-buddy/node_modules/.pnpm/vite-plugin-pwa@0.20.5_vite_6a7845ec33300bf8ea634dd3d643de0a/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectRegister: "inline",
      pwaAssets: {
        disabled: true,
      },
      manifest: false,
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      },
      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  server: {
    port: 7777,
  },
  base: "./",
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJbmZpblxcXFxEb2N1bWVudHNcXFxcZ2l0XFxcXGtqcy1idWRkeVxcXFxhcHBzXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJbmZpblxcXFxEb2N1bWVudHNcXFxcZ2l0XFxcXGtqcy1idWRkeVxcXFxhcHBzXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9JbmZpbi9Eb2N1bWVudHMvZ2l0L2tqcy1idWRkeS9hcHBzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBcclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgc3RyYXRlZ2llczogJ2luamVjdE1hbmlmZXN0JyxcclxuICAgIHNyY0RpcjogJ3NyYycsXHJcbiAgICBmaWxlbmFtZTogJ3N3LnRzJyxcclxuICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgaW5qZWN0UmVnaXN0ZXI6ICdpbmxpbmUnLFxyXG5cclxuICAgIHB3YUFzc2V0czoge1xyXG4gICAgICBkaXNhYmxlZDogdHJ1ZSxcclxuICAgIH0sXHJcblxyXG4gICAgbWFuaWZlc3Q6IGZhbHNlLFxyXG5cclxuICAgIGluamVjdE1hbmlmZXN0OiB7XHJcbiAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxzdmcscG5nLGljb30nXSxcclxuICAgIH0sXHJcblxyXG4gICAgZGV2T3B0aW9uczoge1xyXG4gICAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgICAgbmF2aWdhdGVGYWxsYmFjazogJ2luZGV4Lmh0bWwnLFxyXG4gICAgICBzdXBwcmVzc1dhcm5pbmdzOiB0cnVlLFxyXG4gICAgICB0eXBlOiAnbW9kdWxlJyxcclxuICAgIH0sXHJcbiAgfSlcclxuXSxcclxuICBzZXJ2ZXI6e1xyXG4gICAgcG9ydDogNzc3N1xyXG4gIH0sXHJcbiAgYmFzZTogJy4vJ1xyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThWLFNBQVMsb0JBQW9CO0FBQzNYLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQUMsTUFBTTtBQUFBLElBQ2QsUUFBUTtBQUFBLE1BQ1IsWUFBWTtBQUFBLE1BQ1osUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsY0FBYztBQUFBLE1BQ2QsZ0JBQWdCO0FBQUEsTUFFaEIsV0FBVztBQUFBLFFBQ1QsVUFBVTtBQUFBLE1BQ1o7QUFBQSxNQUVBLFVBQVU7QUFBQSxNQUVWLGdCQUFnQjtBQUFBLFFBQ2QsY0FBYyxDQUFDLGdDQUFnQztBQUFBLE1BQ2pEO0FBQUEsTUFFQSxZQUFZO0FBQUEsUUFDVixTQUFTO0FBQUEsUUFDVCxrQkFBa0I7QUFBQSxRQUNsQixrQkFBa0I7QUFBQSxRQUNsQixNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNFLFFBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxNQUFNO0FBQ1IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
