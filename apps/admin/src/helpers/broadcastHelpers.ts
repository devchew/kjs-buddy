import { Messages } from '../types/Messages.ts';

export type OnMessage = <K extends keyof Messages>(event: MessageEvent, message: K, callback: (data: Messages[K]) => void) => void;

export const onBroadcastMessage: OnMessage = (event, name, callback) => {
    if (event.data.id === name) {
        callback(event.data.data);
    }
}

export type PostMessage = (channel: BroadcastChannel) => <K extends keyof Messages>(message: K, data: Messages[K]) => void;

export const postBroadcastMessage:PostMessage = (channel) => (message, data) => {
    channel.postMessage({ id: message, data });
}
