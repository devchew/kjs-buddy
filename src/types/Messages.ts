import { Countdown } from './Panel.ts';
import { CardInfo, CardPanel } from './Event.ts';

export interface Messages {
    countdown: Countdown;
    panels: CardPanel[];
    cardInfo: CardInfo;
}
