# Version Management

## Overview

KJS Buddy implements a sophisticated version management system that ensures users always have access to the most current version of the application. This system handles version checking, update notifications, cache management, and automatic recovery from loading failures.

## Version Management Architecture

The version management system consists of several interconnected components:

1. **Version Check**: Periodically checks for new application versions
2. **Update Notification**: Alerts users when updates are available
3. **Cache Management**: Clears outdated caches during updates
4. **Recovery Mechanism**: Handles loading failures and forced refreshes

## Version Check Implementation

The application periodically checks for new versions by comparing build timestamps:

```typescript
// Example version checking implementation
export const registerVersionCheck = (
  checkIntervalMs = 5 * 60 * 1000, // Default: check every 5 minutes
): (() => void) => {
  // Function to check application version
  const checkVersion = async () => {
    try {
      // Add cache busting parameter to prevent serving cached version
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

  // Initial check on startup
  checkVersion();
  
  // Set up periodic checking
  const intervalId = setInterval(checkVersion, checkIntervalMs);
  
  // Return function to cancel interval
  return () => clearInterval(intervalId);
};
```

This implementation:
1. Requests the version information file with a cache-busting parameter
2. Compares the server's build timestamp with the locally stored timestamp
3. Prompts the user to reload if a new version is detected
4. Sets up periodic checks based on the specified interval

### Version File Format

The version information is stored in a simple JSON file:

```json
// version.json
{
  "version": "1.0.0",
  "buildTime": "2025-05-15T12:34:56Z",
  "releaseNotes": "Fixed timing issues and improved offline capabilities"
}
```

This file is updated during the build process to include the current timestamp and version information.

## Update Notification Component

The application includes a dedicated component for displaying update notifications:

```tsx
// From AppUpdateChecker.tsx
import React, { useEffect } from "react";
import { useAppUpdater } from "../hooks/useAppUpdater";
import "./AppUpdateChecker.css";

interface AppUpdateCheckerProps {
  checkIntervalMs?: number;
  autoApplyAfterMs?: number | null;
}

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
```

This component:
1. Displays a notification banner when updates are available
2. Provides options to update immediately or postpone
3. Supports automatic application of updates after a specified delay
4. Uses a custom hook to manage update state

### App Updater Hook

The update notification component relies on a custom hook that manages update state:

```typescript
// Example useAppUpdater hook implementation
import { useEffect, useState, useCallback } from 'react';

export const useAppUpdater = (checkIntervalMs = 5 * 60 * 1000) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  
  const checkForUpdate = useCallback(async () => {
    try {
      const response = await fetch(`/version.json?_=${Date.now()}`);
      if (!response.ok) return;
      
      const data = await response.json();
      const storedBuildTime = localStorage.getItem('app_build_time');
      
      if (storedBuildTime && storedBuildTime !== data.buildTime) {
        setUpdateAvailable(true);
      } else if (!storedBuildTime) {
        localStorage.setItem('app_build_time', data.buildTime);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }, []);
  
  useEffect(() => {
    // Check immediately on mount
    checkForUpdate();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(checkForUpdate, checkIntervalMs);
    return () => clearInterval(intervalId);
  }, [checkForUpdate, checkIntervalMs]);
  
  const applyUpdate = useCallback(() => {
    clearCacheAndReload();
  }, []);
  
  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);
  
  return { updateAvailable, applyUpdate, dismissUpdate, checkForUpdate };
};
```

This hook:
1. Manages the state of update availability
2. Provides functions to apply or dismiss updates
3. Implements periodic checking for new versions
4. Handles the comparison of build timestamps

## Service Worker Registration

The service worker registration process includes update handling:

```typescript
// From serviceWorkerRegistration.ts
import { registerSW } from "virtual:pwa-register";
import { registerVersionCheck } from "./utils/versionManager";

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
```

This registration:
1. Sets up a timeout to detect loading failures
2. Provides callback functions for various service worker events
3. Handles update prompts from the service worker itself
4. Initiates the version checking process

## Cache Management

During updates, the application clears all caches to ensure fresh content:

```typescript
// Example cache clearing implementation
export const clearCacheAndReload = async (): Promise<void> => {
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
```

This function:
1. Retrieves all cache names using the Cache API
2. Deletes each cache to ensure no stale content remains
3. Forces a page reload to fetch fresh content from the server

## Recovery Mechanism

The application includes a mechanism for recovering from loading failures:

```typescript
// From serviceWorkerRegistration.ts
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
```

This mechanism:
1. Clears all caches to remove potentially corrupted resources
2. Unregisters all service workers to start fresh
3. Forces a page reload to reinitialize the application

## Service Worker Update Handling

The service worker itself includes logic for handling updates:

```typescript
// From sw.ts
// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();

    // Clear all caches when a new version is activated
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          }),
        );
      }),
    );
  }
});

self.skipWaiting();
clientsClaim();
```

This code:
1. Listens for "SKIP_WAITING" messages to activate new versions immediately
2. Clears all caches when activating a new version
3. Claims clients immediately to ensure all open tabs use the new version

## Version Update Workflow

The complete version update workflow follows these steps:

1. **Detection**: The application detects a new version through periodic checks
2. **Notification**: The user is notified about the available update
3. **Acceptance**: The user accepts the update or it's automatically applied after a delay
4. **Cache Clearing**: All caches are cleared to remove stale content
5. **Reload**: The page is reloaded to fetch and use the new version
6. **Registration**: A new service worker is registered with the updated code
7. **Activation**: The new service worker is activated and takes control

## Build Process Integration

The version management system integrates with the build process:

```javascript
// Example update-version.js script
const fs = require('fs');
const path = require('path');

const generateVersionFile = () => {
  const packageJson = require('../package.json');
  
  const versionInfo = {
    version: packageJson.version,
    buildTime: new Date().toISOString(),
    releaseNotes: process.env.RELEASE_NOTES || 'Bug fixes and improvements'
  };
  
  const outputPath = path.resolve(__dirname, '../public/version.json');
  
  fs.writeFileSync(
    outputPath,
    JSON.stringify(versionInfo, null, 2),
    { encoding: 'utf8' }
  );
  
  console.log(`Version file generated at ${outputPath}`);
  console.log(`Build time: ${versionInfo.buildTime}`);
};

generateVersionFile();
```

This script:
1. Reads the current version from package.json
2. Generates a timestamp for the build
3. Creates or updates the version.json file
4. Logs the build information for reference

## Customizable Update Behavior

The application provides options for customizing update behavior:

```tsx
// Example usage of AppUpdateChecker with custom settings
import React from 'react';
import AppUpdateChecker from './components/AppUpdateChecker';

// In App.tsx
function App() {
  return (
    <>
      {/* Other components */}
      
      {/* Check for updates every 10 minutes */}
      {/* Auto-apply after 2 hours of ignoring */}
      <AppUpdateChecker 
        checkIntervalMs={10 * 60 * 1000}
        autoApplyAfterMs={2 * 60 * 60 * 1000}
      />
    </>
  );
}
```

This approach allows for:
1. Custom update check intervals based on application requirements
2. Automatic application of updates after a specified delay
3. Complete control over the update notification appearance and behavior

## Reload Prompt Component

In addition to the automatic version checker, KJS Buddy includes a manual reload prompt:

```tsx
// From ReloadPrompt.tsx
import React from 'react';
import './ReloadPrompt.css';

const ReloadPrompt: React.FC = () => {
  const [needsRefresh, setNeedsRefresh] = React.useState(false);

  // Check if the page has been loaded for more than 60 minutes
  React.useEffect(() => {
    const pageLoadTime = Date.now();
    
    const checkPageAge = () => {
      const currentTime = Date.now();
      const pageAgeMinutes = (currentTime - pageLoadTime) / (1000 * 60);
      
      // If page has been open for more than 60 minutes, suggest refresh
      if (pageAgeMinutes > 60) {
        setNeedsRefresh(true);
      }
    };
    
    // Check every 5 minutes
    const interval = setInterval(checkPageAge, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!needsRefresh) {
    return null;
  }

  return (
    <div className="reload-prompt">
      <p>This page has been open for a while. Reload to ensure you're using the latest version?</p>
      <div className="reload-prompt-buttons">
        <button 
          className="reload-button"
          onClick={() => window.location.reload()}
        >
          Reload Now
        </button>
        <button 
          className="dismiss-button"
          onClick={() => setNeedsRefresh(false)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ReloadPrompt;
```

This component:
1. Tracks how long the page has been open
2. Suggests a refresh after a significant period (e.g., 60 minutes)
3. Provides options to reload immediately or dismiss the prompt
4. Helps prevent users from working with stale data in long-running sessions

## Version Display

To keep users informed about their current version, KJS Buddy displays version information:

```tsx
// Example VersionInfo component
import React, { useEffect, useState } from 'react';

export const VersionInfo: React.FC = () => {
  const [versionData, setVersionData] = useState<{
    version: string;
    buildTime: string;
  } | null>(null);
  
  useEffect(() => {
    const fetchVersionInfo = async () => {
      try {
        const response = await fetch('/version.json');
        if (response.ok) {
          const data = await response.json();
          setVersionData(data);
        }
      } catch (error) {
        console.error('Error fetching version info:', error);
      }
    };
    
    fetchVersionInfo();
  }, []);
  
  if (!versionData) {
    return null;
  }
  
  const formattedDate = new Date(versionData.buildTime).toLocaleDateString();
  
  return (
    <div className="version-info">
      <p>Version: {versionData.version}</p>
      <p>Build date: {formattedDate}</p>
    </div>
  );
};
```

This component:
1. Fetches and displays the current version information
2. Shows the build date in a user-friendly format
3. Helps users identify which version they're currently using

## Advanced Version Management

For applications with more complex requirements, KJS Buddy supports additional version management features:

### Feature Flags

```typescript
// Example feature flag implementation
interface VersionFeatures {
  enableNewCountdown: boolean;
  enableOfflineSync: boolean;
  enableBetaFeatures: boolean;
}

export const useFeatureFlags = () => {
  const [features, setFeatures] = useState<VersionFeatures>({
    enableNewCountdown: false,
    enableOfflineSync: true,
    enableBetaFeatures: false
  });
  
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('/features.json');
        if (response.ok) {
          const data = await response.json();
          setFeatures(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      }
    };
    
    fetchFeatures();
  }, []);
  
  return features;
};
```

### Phased Rollouts

```typescript
// Example phased rollout implementation
export const shouldShowNewFeature = () => {
  // Get user identifier (could be user ID, device ID, etc.)
  const userId = localStorage.getItem('user_id') || 'anonymous';
  
  // Generate a consistent hash from the user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Normalize hash to 0-100 range
  const normalizedHash = Math.abs(hash % 100);
  
  // Control the rollout percentage (e.g., 25% of users)
  const rolloutPercentage = 25;
  
  return normalizedHash < rolloutPercentage;
};
```

### Version Rollback

```typescript
// Example version rollback mechanism
export const rollbackToVersion = async (targetVersion: string): Promise<boolean> => {
  try {
    // First, check if the target version assets are available
    const response = await fetch(`/versions/${targetVersion}/manifest.json`);
    
    if (!response.ok) {
      console.error(`Version ${targetVersion} not available for rollback`);
      return false;
    }
    
    // Store the target version as the preferred version
    localStorage.setItem('preferred_version', targetVersion);
    
    // Clear current caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
    
    // Reload the page to use the specified version
    window.location.href = `/versions/${targetVersion}/index.html`;
    return true;
  } catch (error) {
    console.error('Error during version rollback:', error);
    return false;
  }
};
```

## Error Tracking and Reporting

To enhance version stability, KJS Buddy includes error tracking:

```typescript
// Example error reporting integration
export const initializeErrorTracking = () => {
  // Get version info
  fetch('/version.json')
    .then(response => response.json())
    .then(versionData => {
      // Set up global error handler
      window.addEventListener('error', (event) => {
        const errorData = {
          message: event.message,
          source: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          version: versionData.version,
          buildTime: versionData.buildTime,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        };
        
        // Log to console in development
        if (import.meta.env.DEV) {
          console.error('Tracked error:', errorData);
        }
        
        // Send to error tracking service in production
        if (import.meta.env.PROD) {
          fetch('/api/log-error', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(errorData),
            // Use keepalive to ensure the request completes even if page is unloading
            keepalive: true
          }).catch(e => console.error('Failed to report error:', e));
        }
      });
      
      console.log('Error tracking initialized for version:', versionData.version);
    })
    .catch(err => {
      console.error('Failed to initialize error tracking:', err);
    });
};
```

This system:
1. Captures runtime errors with detailed context
2. Includes version information with each error report
3. Helps identify version-specific issues
4. Enables targeted fixes in subsequent versions
