import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const defaultPanelContext = {
    number: 0,
    finishTime: -1,
    provisionalStartTime: -1,
    actualStartTime: -1,
    drivingTime: -1,
    resultTime: -1,
    nextPKCTime: -1,
    arrivalTime: -1,
    name: '',
    setFinishTime: () => { },
    setProvisionalStartTime: () => { },
    setActualStartTime: () => { },
    setDrivingTime: () => { },
    setResultTime: () => { },
    setNextPKCTime: () => { },
    setArrivalTime: () => { },
};
const PanelContext = createContext(defaultPanelContext);
export const usePanelContext = () => {
    const context = useContext(PanelContext);
    if (!context) {
        throw new Error('usePanelContext must be used within a PanelProvider');
    }
    return context;
};
export const PanelProvider = (props) => {
    const [panel, setPanel] = useState(props.panel);
    const setFinishTime = (finishTime) => setPanel({ ...panel, finishTime });
    const setProvisionalStartTime = (provisionalStartTime) => setPanel({ ...panel, provisionalStartTime });
    const setActualStartTime = (actualStartTime) => setPanel({ ...panel, actualStartTime });
    const setDrivingTime = (drivingTime) => setPanel({ ...panel, drivingTime });
    const setResultTime = (resultTime) => setPanel({ ...panel, resultTime });
    const setNextPKCTime = (nextPKCTime) => setPanel({ ...panel, nextPKCTime });
    const setArrivalTime = (arrivalTime) => setPanel({ ...panel, arrivalTime });
    useEffect(() => {
        // if actual start time is set, and provisional start time is not set, set provisional start time
        if (panel.actualStartTime === 0 && panel.provisionalStartTime !== 0) {
            if (panel.actualStartTime !== panel.provisionalStartTime) {
                setPanel({ ...panel, actualStartTime: panel.provisionalStartTime });
            }
        }
    }, [panel.actualStartTime, panel.provisionalStartTime]);
    useEffect(() => {
        // if driving time is set, and actual start time is set, calculate arrival time
        if (panel.drivingTime !== 0 && panel.actualStartTime !== 0) {
            if (panel.arrivalTime !== panel.actualStartTime + panel.drivingTime) {
                setPanel({ ...panel, arrivalTime: panel.actualStartTime + panel.drivingTime });
            }
        }
    }, [panel.drivingTime, panel.actualStartTime]);
    useEffect(() => {
        props.onChange(panel);
    }, [panel]);
    return (_jsx(PanelContext.Provider, { value: {
            ...panel,
            setFinishTime,
            setProvisionalStartTime,
            setActualStartTime,
            setDrivingTime,
            setResultTime,
            setNextPKCTime,
            setArrivalTime,
        }, children: props.children }));
};
