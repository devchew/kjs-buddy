/**
 * This module contains functions to help track and manage the application's version
 * and ensure that users always get the latest version after a deployment.
 */

/**
 * Update handler that ensures the service worker is refreshed
 */
const refreshServiceWorker = async (
  registration: ServiceWorkerRegistration,
): Promise<void> => {
  if (registration && registration.waiting) {
    // Send skip waiting message to activate the new service worker
    registration.waiting.postMessage({ type: "SKIP_WAITING" });

    return new Promise<void>((resolve) => {
      // Listen for the controlling service worker to change
      const onControllerChange = () => {
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          onControllerChange,
        );
        resolve();
      };

      navigator.serviceWorker.addEventListener(
        "controllerchange",
        onControllerChange,
      );
    });
  }
};

/**
 * Clear application cache and refresh the page
 */
const clearCacheAndReload = async (): Promise<void> => {
  if ("caches" in window) {
    try {
      // Get all cache names
      const cacheNames = await caches.keys();

      // Delete all caches
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName)),
      );

      console.log("All application caches cleared");
    } catch (err) {
      console.error("Error clearing caches:", err);
    }
  }

  // Force reload from server
  window.location.reload();
};

/**
 * Register a version check interval that will prompt for refresh when
 * a new version is detected
 *
 * @param checkIntervalMs - How often to check for a new version (default: 5 minutes)
 */
const registerVersionCheck = (
  checkIntervalMs = 5 * 60 * 1000,
): (() => void) => {
  // Function to check version
  const checkVersion = async () => {
    try {
      // Add cache busting
      const response = await fetch(`/version.json?_=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        const currentBuildTime = localStorage.getItem("app_build_time");

        if (currentBuildTime && currentBuildTime !== data.buildTime) {
          console.log("New version detected:", data.buildTime);

          // Prompt the user to reload
          if (
            confirm(
              "A new version of the application is available. Reload now?",
            )
          ) {
            localStorage.setItem("app_build_time", data.buildTime);
            clearCacheAndReload();
          }
        } else if (!currentBuildTime) {
          // First run, store the current build time
          localStorage.setItem("app_build_time", data.buildTime);
        }
      }
    } catch (error) {
      console.error("Error checking version:", error);
    }
  };

  // Initial check
  checkVersion();

  // Set up interval for periodic checks
  const intervalId = setInterval(checkVersion, checkIntervalMs);

  // Return function to cancel the interval
  return () => clearInterval(intervalId);
};

export { refreshServiceWorker, clearCacheAndReload, registerVersionCheck };
