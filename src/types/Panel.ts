import { CardPanel } from './Event.ts';

export type PanelContextType = CardPanel & {
    setFinishTime: (finishTime: number) => void;
    setProvisionalStartTime: (provisionalStartTime: number) => void;
    setActualStartTime: (actualStartTime: number) => void;
    setDrivingTime: (drivingTime: number) => void;
    setResultTime: (resultTime: number) => void;
    setNextPKCTime: (nextPKCTime: number) => void;
    setArrivalTime: (arrivalTime: number) => void;
}
export type Countdown = {
    toTime: number;
    message: string;
}
