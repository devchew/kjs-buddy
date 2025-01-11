/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist: RegExp[] | undefined
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV)
    allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL('index.html'),
    { allowlist },
))

self.skipWaiting()
clientsClaim()

let interval: number | undefined;
let count = 0;

const channel = new BroadcastChannel('sw-messages');

channel.addEventListener('message', event => {
    console.log('Received', event.data);

    if (event.data === 'start') {
        interval = setInterval(() => {
            channel.postMessage({ type: 'tick', payload: count++ });
            console.log('tick');
        }, 1000);
    }

    if (event.data === 'stop') {
        clearInterval(interval);
        console.log('stopped');
    }

});
