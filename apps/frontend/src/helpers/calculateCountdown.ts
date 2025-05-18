import { CardPanel } from "../types/Card.ts";
import { Countdown } from "../types/Countdown.ts";
import { getNowAsMsFrommidnight } from "./timeParsers.ts";

const findClosestPanel = (panels: CardPanel[]): CardPanel | undefined => {
  const now = getNowAsMsFrommidnight();
  return panels.find((panel) => panel.arrivalTime - now > 0);
};

export const calculateCountdown = (panels: CardPanel[]): Countdown => {
  const closestPanel = findClosestPanel(panels);
  if (closestPanel) {
    return {
      toTime: closestPanel.arrivalTime,
      message: `staw się na PKC${closestPanel.number}`,
    };
  }
  return { toTime: 0, message: "" };
};
