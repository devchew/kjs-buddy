/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import {
  onBroadcastMessage,
  postBroadcastMessage,
} from "./helpers/broadcastHelpers.ts";
import { calculateCountdown } from "./helpers/calculateCountdown.ts";
import { Countdown } from "./types/Countdown.ts";
import { getNowAsMsFrommidnight } from "./helpers/timeParsers.ts";

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

const sendNotification = async (title: string, body: string) => {
  try {
    await self.registration.showNotification(title, {
      body,
      icon: "/icon-192x192.png", // Add an icon (required for some mobile browsers)
      badge: "/badge-72x72.png", // Add a badge for mobile
      tag: "vibration-sample",
      requireInteraction: true, // Keeps notification visible on mobile
      silent: false,
      data: {
        // Add data for handling clicks
        url: "https://app.rajdex.pl/", // Replace with your URL
      },
    });
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Failed to show notification:", error);
  }
};

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  // Handle notification click
  event.waitUntil(self.clients.openWindow(event.notification.data?.url || "/"));
});


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
