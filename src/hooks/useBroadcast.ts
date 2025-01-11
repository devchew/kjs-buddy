import { useEffect, useState } from 'react';
import { Messages } from '../types/Messages.ts';

type Subscribe = <K extends keyof Messages>(message: K, callback: (data: Messages[K]) => void) => void;
type PostMessage = <K extends keyof Messages>(message: K, data: Messages[K]) => void;

export const useBroadcast = () => {
    const [channel] = useState(() => new BroadcastChannel('sw-messages'));
    const [subscribers, setSubscribers] = useState<AbortController[]>([]);

    const subscribe: Subscribe = (message, callback) => {

        const abortController = new AbortController();

        channel.addEventListener('message', (event) => {
            if (event.data.id === message) {
                callback(event as any);
            }
        }, { signal: abortController.signal });

        //setSubscribers((prev) => [...prev, abortController]);
    }

    useEffect(() => {
        return () => {
            subscribers.forEach((sub) => sub.abort());
        }
    }, []);

    const postMessage:PostMessage = (message, data) => {
        channel.postMessage({ id: message, data });
    }


    return { subscribe, postMessage };
}
