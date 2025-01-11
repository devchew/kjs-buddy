import { CardPanel } from '../types/Event.ts';
import { Countdown } from '../types/Panel.ts';
import { getNowAsMsFrommidnight } from './timeParsers.ts';


const findClosestPanel = (panels: CardPanel[]): CardPanel | undefined => {
    const now = getNowAsMsFrommidnight();
    return panels.find((panel) => panel.arrivalTime - now > 0);
}

export const calculateCountdown = (panels: CardPanel[]): Countdown => {
    const closestPanel = findClosestPanel(panels);
    if (closestPanel) {
        return ({toTime: closestPanel.arrivalTime, message: `Next panel: ${closestPanel.number}`});
    }
    return ({toTime: 0, message: ''});
}
