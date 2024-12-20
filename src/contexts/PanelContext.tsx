import { CardPanel } from '../types/Event.ts';
import { defaultEvent } from './defaultEvent.ts';
import { createContext, FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react';

type PanelContextType = CardPanel & {
    setFinishTime: (finishTime: number) => void;
    setProvisionalStartTime: (provisionalStartTime: number) => void;
    setActualStartTime: (actualStartTime: number) => void;
    setDrivingTime: (drivingTime: number) => void;
    setResultTime: (resultTime: number) => void;
    setNextPKCTime: (nextPKCTime: number) => void;
    setArrivalTime: (arrivalTime: number) => void;
}

const defaultPanelContext: PanelContextType = {
    ...defaultEvent.panels[0],
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
            setPanel({...panel, actualStartTime: panel.provisionalStartTime});
        }
    }, [panel.actualStartTime, panel.provisionalStartTime]);

    useEffect(() => {
        // if driving time is set, and actual start time is set, calculate arrival time
        if (panel.drivingTime !== 0 && panel.actualStartTime !== 0) {
            setPanel({...panel, arrivalTime: panel.actualStartTime + panel.drivingTime});
            console.log('Arrival time updated', panel.arrivalTime);
        }
    }, [panel.drivingTime, panel.actualStartTime]);

    useEffect(() => {
        props.onChange(panel);
        console.log('Panel updated', panel);
    }, [panel]);

    return (
        <PanelContext.Provider value={{...panel, setFinishTime, setProvisionalStartTime, setActualStartTime, setDrivingTime, setResultTime, setNextPKCTime, setArrivalTime}}>
            {props.children}
        </PanelContext.Provider>
    )
}
