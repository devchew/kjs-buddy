import { registerSW } from "virtual:pwa-register";
import { registerVersionCheck } from "./utils/versionManager";

/**
 * Initialize the service worker with automatic updates
 * and periodic version checking
 */
export const initializeServiceWorker = (): void => {
  // Set up load timeout to detect large loading failures
  const loadTimeout = setTimeout(() => {
    console.warn(
      "Application load timeout reached - forcing service worker refresh",
    );
    forceServiceWorkerRefresh();
  }, 15000); // 15 second timeout

  // Register service worker
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm("New content is available. Reload to update?")) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      // Clear timeout as app has loaded successfully
      clearTimeout(loadTimeout);
      console.log("App ready to work offline");
    },
    onRegistered(_registration: ServiceWorkerRegistration | undefined) {
      // Clear timeout as service worker registered successfully
      clearTimeout(loadTimeout);
    },
    onRegisterError(error: Error) {
      console.error("Service worker registration failed:", error);
      forceServiceWorkerRefresh();
    },
    immediate: true,
  });

  // Register version check every 5 minutes
  registerVersionCheck(5 * 60 * 1000);

  // Log that service worker initialization is complete
  console.log("Service worker initialization complete");
};

/**
 * Force refresh the service worker and reload the page
 * Used when large loading failures are detected
 */
const forceServiceWorkerRefresh = async (): Promise<void> => {
  console.log("Forcing service worker refresh due to loading failure");

  try {
    // Attempt to clear all caches
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName)),
      );
      console.log("All caches cleared");
    }

    // Unregister existing service workers
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));
      console.log("Service workers unregistered");
    }
  } catch (err) {
    console.error("Error during force refresh:", err);
  }

  // Force reload page from server
  window.location.reload();
};
