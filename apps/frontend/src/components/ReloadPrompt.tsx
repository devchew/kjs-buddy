import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import "./ReloadPrompt.css";
import { checkForNewVersion, clearAllCaches } from "../utils/cacheManager";

// Refresh time interval in milliseconds
const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour
// Version check interval - 5 minutes
const VERSION_CHECK_INTERVAL = 5 * 60 * 1000;

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      // Check for updates periodically
      r &&
        setInterval(() => {
          console.log("Checking for SW updates");
          r.update();
        }, REFRESH_INTERVAL);
    },
    onRegisterError(error: any) {
      console.error("SW registration error", error);
    },
  });

  const [visible, setVisible] = useState(false);

  // Periodically check for new version using version.json
  useEffect(() => {
    const checkVersionInterval = setInterval(async () => {
      const hasNewVersion = await checkForNewVersion();
      if (hasNewVersion) {
        setNeedRefresh(true);
      }
    }, VERSION_CHECK_INTERVAL);

    // Initial check on mount
    checkForNewVersion().then((hasNewVersion) => {
      if (hasNewVersion) setNeedRefresh(true);
    });

    return () => clearInterval(checkVersionInterval);
  }, [setNeedRefresh]);

  // Close the prompt
  const close = () => {
    setVisible(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  // Update and reload
  const handleUpdate = async () => {
    console.log("Updating service worker and reloading page");

    // Clear all caches first
    await clearAllCaches();

    // This will send the SKIP_WAITING message to the service worker
    updateServiceWorker(true);
  };

  useEffect(() => {
    if (offlineReady || needRefresh) {
      setVisible(true);
    }
  }, [offlineReady, needRefresh]);

  if (!visible) return null;

  return (
    <div className="reload-prompt-container">
      {" "}
      <div className="reload-prompt">
        <div className="message">
          {offlineReady ? (
            <span>Aplikacja gotowa do pracy offline</span>
          ) : (
            <span>
              Dostępna nowa zawartość, kliknij przycisk przeładowania, aby
              zaktualizować.
            </span>
          )}
        </div>
        <div className="buttons">
          {needRefresh && (
            <button className="refresh-button" onClick={handleUpdate}>
              Przeładuj
            </button>
          )}
          <button className="close-button" onClick={close}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
