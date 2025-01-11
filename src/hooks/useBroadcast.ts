import { useEffect, useState } from 'react';
import { Messages } from '../types/Messages.ts';
import { onBroadcastMessage, postBroadcastMessage } from '../helpers/broadcastHelpers.ts';



export type Subscribe = <K extends keyof Messages>(message: K, callback: (data: Messages[K]) => void) => void;
export type PostMessage = <K extends keyof Messages>(message: K, data: Messages[K]) => void;

export const useBroadcast = () => {
    const [channel] = useState(() => new BroadcastChannel('sw-messages'));
    const [subscribers] = useState<AbortController[]>([]);

    const subscribe: Subscribe = (message, callback) => {

        const abortController = new AbortController();

        channel.addEventListener('message', (event) => {
            onBroadcastMessage(event, message, callback);
        }, { signal: abortController.signal });

        //setSubscribers((prev) => [...prev, abortController]);
    }

    useEffect(() => {
        return () => {
            subscribers.forEach((sub) => sub.abort());
        }
    }, []);

    const postMessage:PostMessage = postBroadcastMessage(channel);


    return { subscribe, postMessage };
}
