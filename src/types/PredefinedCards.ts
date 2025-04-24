import { CardInfo } from './Event';

export interface PanelTemplate {
  name: string;
  drivingTime: number;
  provisionalStartTime: number;
  finishTime?: number;
  actualStartTime?: number;
  resultTime?: number;
  nextPKCTime?: number;
  arrivalTime?: number;
}

export interface PredefinedPanelConfig {
  number: number;
  name: string;
  drivingTime: number;
  provisionalStartTime: number;
  finishTime?: number;
  actualStartTime?: number;
  resultTime?: number;
  nextPKCTime?: number;
  arrivalTime?: number;
}

export interface PredefinedCard {
  id: string;
  name: string;
  description: string;
  cardInfo: CardInfo;
  panelCount: number;
  panelTemplate: PanelTemplate; // Default template for auto-generated panels
  panels?: PredefinedPanelConfig[]; // Specific panel configurations if provided
}

export interface PredefinedCardsData {
  predefinedCards: PredefinedCard[];
}