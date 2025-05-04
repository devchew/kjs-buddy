import { CardInfo, CardPanel } from './Card';

export interface StoredCard {
  id: string;
  cardInfo: CardInfo;
  panels: CardPanel[];
  lastUsed: number; // timestamp of when the card was last accessed
}

export interface CardsStore {
  cards: StoredCard[];
}