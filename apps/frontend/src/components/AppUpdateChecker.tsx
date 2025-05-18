import React, { useEffect } from "react";
import { useAppUpdater } from "../hooks/useAppUpdater";
import "./AppUpdateChecker.css";

interface AppUpdateCheckerProps {
  checkIntervalMs?: number;
  autoApplyAfterMs?: number | null;
}

/**
 * Component that checks for application updates
 * Shows a prompt when updates are available
 */
const AppUpdateChecker: React.FC<AppUpdateCheckerProps> = ({
  checkIntervalMs = 5 * 60 * 1000, // Default: check every 5 minutes
  autoApplyAfterMs = null, // Default: don't auto-apply
}) => {
  const { updateAvailable, applyUpdate, dismissUpdate } =
    useAppUpdater(checkIntervalMs);

  // Auto-apply update after specified time if autoApplyAfterMs is provided
  useEffect(() => {
    if (updateAvailable && autoApplyAfterMs !== null) {
      const timer = setTimeout(() => {
        applyUpdate();
      }, autoApplyAfterMs);

      return () => clearTimeout(timer);
    }
  }, [updateAvailable, autoApplyAfterMs, applyUpdate]);

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="app-update-container">
      <div className="app-update-banner">
        <div className="app-update-message">Nowa wersja jest dostępna!</div>
        <div className="app-update-buttons">
          <button
            onClick={applyUpdate}
            className="app-update-button app-update-button-primary"
          >
            Aktualizuj teraz
          </button>
          <button
            onClick={dismissUpdate}
            className="app-update-button app-update-button-secondary"
          >
            Później
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppUpdateChecker;
