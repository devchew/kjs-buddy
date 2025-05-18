import { useEffect, useState, useCallback } from "react";

/**
 * Custom hook to check for application updates
 * @param checkInterval - Interval in milliseconds to check for updates (default: 5 minutes)
 * @returns {Object} - Contains update status and functions to manage updates
 */
export function useAppUpdater(checkInterval = 5 * 60 * 1000) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [lastChecked, setLastChecked] = useState(Date.now());

  // Check if the version.json file has changed
  const checkForUpdates = useCallback(async () => {
    try {
      // Add cache busting query param
      const response = await fetch(`/version.json?t=${Date.now()}`);
      if (!response.ok) return false;

      const data = await response.json();
      const currentBuildTime = localStorage.getItem("app_build_time");

      // If there's no stored build time or it's different, we have an update
      if (!currentBuildTime || currentBuildTime !== data.buildTime) {
        console.log("New version available:", data.buildTime);
        localStorage.setItem("app_build_time", data.buildTime);
        setUpdateAvailable(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking for updates:", error);
      return false;
    } finally {
      setLastChecked(Date.now());
    }
  }, []);

  // Apply the update by reloading the page
  const applyUpdate = useCallback(() => {
    // Force reload the page
    window.location.reload();
  }, []);

  // Dismiss the update notification
  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  // Check for updates on component mount and at specified intervals
  useEffect(() => {
    // First check on mount
    checkForUpdates();

    // Set up interval for periodic checks
    const interval = setInterval(checkForUpdates, checkInterval);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [checkForUpdates, checkInterval]);

  return {
    updateAvailable,
    checkForUpdates,
    applyUpdate,
    dismissUpdate,
    lastChecked,
  };
}
