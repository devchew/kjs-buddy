/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { onBroadcastMessage, postBroadcastMessage } from './helpers/broadcastHelpers.ts';
import { calculateCountdown } from './helpers/calculateCountdown.ts';
import { Countdown } from './types/Panel.ts';
import { getNowAsMsFrommidnight } from './helpers/timeParsers.ts';

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

let countdownNotifyTimer: number | undefined;
const updateCountdownNotify = (countdown: Countdown) => {

    clearTimeout(countdownNotifyTimer);
    if (countdown.toTime === 0 && countdown.message === '') {
        return;
    }

    // 5 minutes before the countdown, send a notification
    const when = countdown.toTime - getNowAsMsFrommidnight() - 300000;

    countdownNotifyTimer = setTimeout(() => {
        sendNotification('Next panel', countdown.message).then(r => console.log('Notification sent', r));
    }, when);
}

channel.addEventListener('message', event => {
    console.log('Received', event.data);

    onBroadcastMessage(event, 'panels', (data) => {
        const countdown = calculateCountdown(data);
        updateCountdownNotify(countdown);
        postMessage('countdown', countdown);
    });

    onBroadcastMessage(event, 'notifiyTest', (data) => {
        sendNotification('Test', data).then(r => console.log('Notification sent', r));
    });

});
