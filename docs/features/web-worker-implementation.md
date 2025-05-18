# Web Worker Implementation

## Overview

KJS Buddy utilizes Web Workers to enhance application performance, provide offline capabilities, and enable background processing. The implementation centers around a service worker that handles caching, background synchronization, notifications, and version management.

## Service Worker Architecture

The service worker implementation in KJS Buddy consists of several interconnected components:

1. **Registration**: Handled in the main application thread
2. **Service Worker Script**: Contains the core functionality
3. **Communication Channel**: Enables message passing between the main thread and service worker
4. **Utility Functions**: Helper methods for specific tasks

## Service Worker Registration

The service worker is registered when the application initializes:

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

This registration process:
1. Sets up a timeout to detect loading failures
2. Registers the service worker with various event handlers
3. Sets up periodic version checking
4. Provides recovery mechanisms for registration errors

## Core Service Worker Functionality

The main service worker script (`sw.ts`) implements several critical features:

### 1. Precaching and Cache Management

```typescript
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: RegExp[] | undefined;
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist }),
);
```

This section:
- Precaches assets generated during the build process
- Cleans up outdated caches to prevent stale content
- Sets up a navigation route to enable offline access
- Configures different behavior for development environments

### 2. Version Management

```typescript
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
- Enables the application to force an update when new content is available
- Cleans up all caches when updating
- Claims control of clients immediately without waiting for refresh

### 3. Notification System

```typescript
const sendNotification = async (title: string, body: string) => {
  await self.registration.showNotification(title, {
    body,
    tag: "vibration-sample",
  });
};
```

This function allows the service worker to display notifications to users even when the application is not in the foreground.

### 4. Countdown Timer Management

```typescript
const channel = new BroadcastChannel("sw-messages");
const postMessage = postBroadcastMessage(channel);

let countdown5MinNotifyTimer: number | undefined;
let countdown1MinNotifyTimer: number | undefined;

const updateCountdownNotify = (countdown: Countdown) => {
  clearTimeout(countdown5MinNotifyTimer);
  clearTimeout(countdown1MinNotifyTimer);
  if (countdown.toTime === 0 && countdown.message === "") {
    return;
  }

  // 5 minutes before the countdown, send a notification
  const when5 = countdown.toTime - getNowAsMsFrommidnight() - 300000;
  // 1 minute before the countdown, send a notification
  const when1 = countdown.toTime - getNowAsMsFrommidnight() - 60000;

  if (when5 > 0) {
    countdown5MinNotifyTimer = setTimeout(() => {
      sendNotification("PKC 5 minut!", countdown.message);
    }, when5);
  }

  if (when1 > 0) {
    countdown1MinNotifyTimer = setTimeout(() => {
      sendNotification("PKC 1 minuta", countdown.message);
    }, when1);
  }
};
```

This functionality:
- Sets up timers for notifications at predefined intervals (5 minutes, 1 minute)
- Clears existing timers when new countdown data is received
- Calculates the exact timing for notifications based on current time

### 5. Message Handling

```typescript
channel.addEventListener("message", (event) => {
  onBroadcastMessage(event, "panels", (data) => {
    const countdown = calculateCountdown(data);
    updateCountdownNotify(countdown);
    postMessage("countdown", countdown);
  });

  onBroadcastMessage(event, "notifiyTest", (data) => {
    sendNotification("Test", data).then((r) =>
      console.log("Notification sent", r),
    );
  });
});
```

The service worker listens for specific messages from the main application:
- "panels" messages trigger countdown calculations and notification scheduling
- "notifiyTest" messages allow testing of the notification system

## Communication Utilities

KJS Buddy implements a structured communication system between the main thread and service worker:

```typescript
// From broadcastHelpers.ts
import { Messages } from "../types/Messages.ts";

export type OnMessage = <K extends keyof Messages>(
  event: MessageEvent,
  message: K,
  callback: (data: Messages[K]) => void,
) => void;

export const onBroadcastMessage: OnMessage = (event, name, callback) => {
  if (event.data.id === name) {
    callback(event.data.data);
  }
};

export type PostMessage = (
  channel: BroadcastChannel,
) => <K extends keyof Messages>(message: K, data: Messages[K]) => void;

export const postBroadcastMessage: PostMessage =
  (channel) => (message, data) => {
    channel.postMessage({ id: message, data });
  };
```

This system:
- Provides type-safe message passing between threads
- Simplifies the handling of different message types
- Ensures proper data formatting for all communications

## Recovery Mechanisms

The service worker includes robust error recovery mechanisms:

```typescript
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

This function:
- Cleans up all cached resources
- Unregisters existing service worker registrations
- Forces a fresh page reload from the server
- Is triggered by loading failures or registration errors

## Main Thread Integration

The main application thread integrates with the service worker through various components:

### 1. Service Worker Initialization

```typescript
// From main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeServiceWorker } from "./serviceWorkerRegistration";

// Initialize service worker for PWA functionality
// This will manage cache refreshes after deployments
initializeServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 2. Update Checking Component

```typescript
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

### 3. Background Sync Component

```typescript
// From BackgroundSync.tsx
import { useCardContext } from "@internal/rally-card";
import { useEffect } from "react";
import { CardInfo, CardPanel } from "../types/Card.ts";

export const BackgroundSync = () => {
  const { updateCard } = useCardContext();

  useEffect(() => {
    const currentCard = localStorage.getItem("currentCard");
    if (!currentCard) {
      return;
    }
    try {
      const card = JSON.parse(currentCard) as {
        cardInfo: CardInfo;
        panels: CardPanel[];
        id: string;
      };
      updateCard(card);
    } catch (e) {
      // Failed to parse card from localStorage
    }
  }, []);

  return null;
};
```

## PWA Manifest Configuration

The service worker relies on a properly configured web app manifest:

```json
// manifest.json
{
  "name": "KJS Buddy",
  "short_name": "KJSBuddy",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4c8bf5",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

This manifest:
- Defines how the application appears when installed on devices
- Specifies icons for different screen sizes
- Sets the display mode to "standalone" for a native-like experience
- Configures theme colors for the application

## Advanced Features

### 1. Custom Cache Management

The service worker can implement custom caching strategies beyond the default workbox configurations:

```typescript
// Example of a custom cache strategy for API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);
```

### 2. Background Sync for Offline Operations

For operations that require server connectivity, KJS Buddy can implement background sync:

```typescript
// Example background sync implementation
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(registration => {
    // Store failed operations in IndexedDB
    storeFailedOperation(operation).then(() => {
      // Register for background sync
      registration.sync.register('sync-cards');
    });
  });
}

// In service worker
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cards') {
    event.waitUntil(syncCards());
  }
});
```

### 3. Push Notifications

KJS Buddy's service worker architecture supports push notifications for important events:

```typescript
// Example of push notification handling
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: data.url
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
```

## Performance Considerations

The implementation incorporates several performance optimizations:

1. **Selective Caching**: Only essential resources are precached to minimize storage usage
2. **On-Demand Caching**: Additional resources are cached as they are accessed
3. **Offline-First Approach**: Critical functionality works without network connection
4. **Background Processing**: Heavy computations occur in the service worker to keep the main thread responsive

## Security Considerations

The service worker implementation follows security best practices:

1. **HTTPS Only**: Service workers only operate on secure contexts (HTTPS)
2. **Scope Limitations**: Service worker access is limited to its registered scope
3. **Content Security Policy**: Appropriate CSP headers are set to prevent misuse
4. **Notification Permission**: Notifications require explicit user permission

## Browser Compatibility

The service worker implementation is designed to work across modern browsers:

- Chrome/Edge (Chromium-based): Full support
- Firefox: Full support
- Safari: Support for basic functionality (some limitations with background sync)
- Mobile browsers: Variable support based on the browser

A feature detection approach ensures graceful degradation in browsers with limited support:

```typescript
if ('serviceWorker' in navigator) {
  // Register service worker
} else {
  // Fallback for browsers without service worker support
  console.log('Service workers not supported in this browser');
}
```
