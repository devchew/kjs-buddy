/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { onBroadcastMessage, postBroadcastMessage } from './helpers/broadcastHelpers.ts';
import { calculateCountdown } from './helpers/calculateCountdown.ts';

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


const sendNotification = async (title: string, body: string) => {
    await self.registration.showNotification(title, {
        body,
        tag: 'vibration-sample'
    })
}

const channel = new BroadcastChannel('sw-messages');

const postMessage = postBroadcastMessage(channel);

channel.addEventListener('message', event => {
    console.log('Received', event.data);

    onBroadcastMessage(event, 'panels', (data) => {
        const countdown = calculateCountdown(data);
        postMessage('countdown', countdown);
    });

    onBroadcastMessage(event, 'notifiyTest', (data) => {
        sendNotification('Test', data).then(r => console.log('Notification sent', r));
    });

});
