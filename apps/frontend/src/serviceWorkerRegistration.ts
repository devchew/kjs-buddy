import { registerSW } from "virtual:pwa-register";
import { registerVersionCheck } from "./utils/versionManager";

/**
 * Initialize the service worker with automatic updates
 * and periodic version checking
 */
export const initializeServiceWorker = (): void => {
  // Register service worker
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm("New content is available. Reload to update?")) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log("App ready to work offline");
    },
    immediate: true,
  });

  // Register version check every 5 minutes
  registerVersionCheck(5 * 60 * 1000);

  // Log that service worker initialization is complete
  console.log("Service worker initialization complete");
};
