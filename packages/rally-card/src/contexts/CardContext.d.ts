import { type FunctionComponent, type PropsWithChildren } from 'react';
import type { Card, CardInfo, CardPanel } from '../types/Card.ts';
export type CardContextType = Card & {
    updateCard: (card: Card) => void;
    updateCardInfo: (cardInfo: CardInfo) => void;
    updatePanels: (panels: CardPanel[]) => void;
    updatePanelByNumber: (panelNumber: number, panel: CardPanel) => void;
    addPanel: () => void;
    deletePanel: (panelNumber: number) => void;
    updatePanelName: (panelNumber: number, name: string) => void;
    setId: (id: string) => void;
    unloadCard: () => void;
    isEditMode: boolean;
    setIsEditMode: (isEditMode: boolean) => void;
};
export declare const useCardContext: () => CardContextType;
export declare const CardProvider: FunctionComponent<PropsWithChildren>;
