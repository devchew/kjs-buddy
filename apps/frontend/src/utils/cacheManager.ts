/**
 * Cache management utilities for service worker updates
 */

/**
 * Clear all caches managed by the service worker
 * @returns {Promise<boolean>} Promise that resolves to true if all caches were cleared
 */
export const clearAllCaches = async (): Promise<boolean> => {
  try {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName)),
      );
      console.log("All caches cleared successfully");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error clearing caches:", error);
    return false;
  }
};

/**
 * Unregister all service workers
 * @returns {Promise<boolean>} Promise that resolves to true if all service workers were unregistered
 */
export const unregisterServiceWorkers = async (): Promise<boolean> => {
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      );
      console.log("All service workers unregistered");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error unregistering service workers:", error);
    return false;
  }
};

/**
 * Force reload the page
 */
export const forcePageReload = (): void => {
  window.location.reload();
};

/**
 * Completely refresh the app by clearing caches, unregistering service workers, and reloading the page
 */
export const refreshApp = async (): Promise<void> => {
  await clearAllCaches();
  await unregisterServiceWorkers();
  forcePageReload();
};

/**
 * Check for a new version from the version.json file
 * @returns {Promise<boolean>} Promise that resolves to true if a new version is available
 */
export const checkForNewVersion = async (): Promise<boolean> => {
  try {
    // Add cache busting query param to avoid getting cached version
    const response = await fetch(`/version.json?_=${Date.now()}`);
    if (!response.ok) return false;

    const data = await response.json();

    // Check if we have stored the current version in localStorage
    const storedVersion = localStorage.getItem("app_version");
    const storedBuildTime = localStorage.getItem("app_build_time");

    // If we have a new version or build time, update localStorage and return true
    if (
      !storedVersion ||
      !storedBuildTime ||
      storedVersion !== data.version ||
      storedBuildTime !== data.buildTime
    ) {
      localStorage.setItem("app_version", data.version);
      localStorage.setItem("app_build_time", data.buildTime);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking for new version:", error);
    return false;
  }
};
