import { CardPanel } from '../types/Card.ts';
import { createContext, FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react';


export type PanelContextType = CardPanel & {
    setFinishTime: (finishTime: number) => void;
    setProvisionalStartTime: (provisionalStartTime: number) => void;
    setActualStartTime: (actualStartTime: number) => void;
    setDrivingTime: (drivingTime: number) => void;
    setResultTime: (resultTime: number) => void;
    setNextPKCTime: (nextPKCTime: number) => void;
    setArrivalTime: (arrivalTime: number) => void;
}

const defaultPanelContext: PanelContextType = {
    number: 0,
    finishTime: -1,
    provisionalStartTime: -1,
    actualStartTime: -1,
    drivingTime: -1,
    resultTime: -1,
    nextPKCTime: -1,
    arrivalTime: -1,
    name: '',
    setFinishTime: () => {},
    setProvisionalStartTime: () => {},
    setActualStartTime: () => {},
    setDrivingTime: () => {},
    setResultTime: () => {},
    setNextPKCTime: () => {},
    setArrivalTime: () => {},
}

const PanelContext = createContext<PanelContextType>(defaultPanelContext);

export const usePanelContext = () => {
    const context = useContext(PanelContext);
    if (!context) {
        throw new Error('usePanelContext must be used within a PanelProvider');
    }
    return context;
}

type PanelProviderProps = {
    panel: CardPanel;
    onChange: (panel: CardPanel) => void;
}

export const PanelProvider: FunctionComponent<PropsWithChildren<PanelProviderProps>> = (props) => {
    const [panel, setPanel] = useState(props.panel);
    const setFinishTime = (finishTime: number) => setPanel({...panel, finishTime});
    const setProvisionalStartTime = (provisionalStartTime: number) => setPanel({...panel, provisionalStartTime});
    const setActualStartTime = (actualStartTime: number) => setPanel({...panel, actualStartTime});
    const setDrivingTime = (drivingTime: number) => setPanel({...panel, drivingTime});
    const setResultTime = (resultTime: number) => setPanel({...panel, resultTime});
    const setNextPKCTime = (nextPKCTime: number) => setPanel({...panel, nextPKCTime});
    const setArrivalTime = (arrivalTime: number) => setPanel({...panel, arrivalTime});

    useEffect(() => {
        // if actual start time is set, and provisional start time is not set, set provisional start time
        if (panel.actualStartTime === 0 && panel.provisionalStartTime !== 0) {
            if (panel.actualStartTime !== panel.provisionalStartTime) {
                setPanel({...panel, actualStartTime: panel.provisionalStartTime});
            }
        }
    }, [panel.actualStartTime, panel.provisionalStartTime]);

    useEffect(() => {
        // if driving time is set, and actual start time is set, calculate arrival time
        if (panel.drivingTime !== 0 && panel.actualStartTime !== 0) {
            if (panel.arrivalTime !== panel.actualStartTime + panel.drivingTime) {
                setPanel({...panel, arrivalTime: panel.actualStartTime + panel.drivingTime});
            }
        }
    }, [panel.drivingTime, panel.actualStartTime]);

    useEffect(() => {
        props.onChange(panel);
    }, [panel]);

    return (
        <PanelContext.Provider value={
            {
                ...panel,
                setFinishTime,
                setProvisionalStartTime,
                setActualStartTime,
                setDrivingTime,
                setResultTime,
                setNextPKCTime,
                setArrivalTime,
            }
        }>
            {props.children}
        </PanelContext.Provider>
    )
}
