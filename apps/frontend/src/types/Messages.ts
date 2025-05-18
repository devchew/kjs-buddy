import { Countdown } from "./Countdown.ts";
import { CardInfo, CardPanel } from "./Card.ts";

export interface Messages {
  countdown: Countdown;
  panels: CardPanel[];
  cardInfo: CardInfo;
  notifiyTest: string;
}
