import type { CardPanel } from '../types/Card.ts';
import { type FunctionComponent, type PropsWithChildren } from 'react';
export type PanelContextType = CardPanel & {
    setFinishTime: (finishTime: number) => void;
    setProvisionalStartTime: (provisionalStartTime: number) => void;
    setActualStartTime: (actualStartTime: number) => void;
    setDrivingTime: (drivingTime: number) => void;
    setResultTime: (resultTime: number) => void;
    setNextPKCTime: (nextPKCTime: number) => void;
    setArrivalTime: (arrivalTime: number) => void;
};
export declare const usePanelContext: () => PanelContextType;
type PanelProviderProps = {
    panel: CardPanel;
    onChange: (panel: CardPanel) => void;
};
export declare const PanelProvider: FunctionComponent<PropsWithChildren<PanelProviderProps>>;
export {};
