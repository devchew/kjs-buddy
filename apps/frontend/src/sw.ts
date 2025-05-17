/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { onBroadcastMessage, postBroadcastMessage } from './helpers/broadcastHelpers.ts';
import { calculateCountdown } from './helpers/calculateCountdown.ts';
import { Countdown } from './types/Countdown.ts';
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

let countdown5MinNotifyTimer: number | undefined;
let countdown1MinNotifyTimer: number | undefined;

const updateCountdownNotify = (countdown: Countdown) => {

    clearTimeout(countdown5MinNotifyTimer);
    clearTimeout(countdown1MinNotifyTimer);
    if (countdown.toTime === 0 && countdown.message === '') {
        return;
    }

    // 5 minutes before the countdown, send a notification
    const when5 = countdown.toTime - getNowAsMsFrommidnight() - 300000;
    // 1 minute before the countdown, send a notification
    const when1 = countdown.toTime - getNowAsMsFrommidnight() - 60000;


    if (when5 > 0) {
        countdown5MinNotifyTimer = setTimeout(() => {
            sendNotification('PKC 5 minut!', countdown.message);
        }, when5);
    }

    if (when1 > 0) {
        countdown1MinNotifyTimer = setTimeout(() => {
            sendNotification('PKC 1 minuta', countdown.message);
        }, when1);
    }
}

channel.addEventListener('message', event => {
    onBroadcastMessage(event, 'panels', (data) => {
        const countdown = calculateCountdown(data);
        updateCountdownNotify(countdown);
        postMessage('countdown', countdown);
    });    onBroadcastMessage(event, 'notifiyTest', (data) => {
        sendNotification('Test', data);
    });

});
