import { createContext, FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { CardInfo, CardPanel, EventDetails } from '../types/Event.ts';
import { defaultEvent } from './defaultEvent.ts';
import { useBroadcast } from '../hooks/useBroadcast.ts';
import { Countdown } from '../types/Panel.ts';
import { separateValuesToMs } from '../helpers/timeParsers.ts';

export type CardContextType = EventDetails &{
    loading: boolean;
    updateCardInfo: (cardInfo: CardInfo) => void;
    updatePanels: (panels: CardPanel[]) => void;
    updatePanelByNumber: (panelNumber: number, panel: CardPanel) => void;
    countdown: Countdown;
}


const defaultCardContext: CardContextType = {
    loading: false,
    ...defaultEvent,
    updateCardInfo: () => {},
    updatePanels: () => {},
    updatePanelByNumber: () => {},
    countdown: {toTime: 0, message: ''},
}

const CardContext = createContext<CardContextType>(defaultCardContext);

export const useCardContext = () => {
    const context = useContext(CardContext);
    if (!context) {
        throw new Error('useCardContext must be used within a CardProvider');
    }
    return context;
}

export const CardProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const { subscribe, postMessage }  = useBroadcast();
    const [countdown, setCountdown] = useState<Countdown>({toTime: 0, message: ''});

    const [loading, setLoading] = useState(true);
    const [cardInfo, setCardInfo] = useState<CardInfo>(defaultCardContext.cardInfo);
    const [panels, setPanels] = useState<CardPanel[]>([]);

    const updateCardInfo = (cardInfo: CardInfo) => setCardInfo(cardInfo);
    const updatePanels = (panels: CardPanel[]) => setPanels(panels);
    const updatePanelByNumber = (panelNumber: number, panel: CardPanel) => setPanels(panels.map((p) => p.number === panelNumber ? panel : p));


    // temporary
    //
    // const getNowAsMsFrommidnight = () => {
    //     const now = new Date();
    //     return separateValuesToMs([now.getHours(), now.getMinutes(), now.getSeconds(), 0]);
    // }
    //
    // const findClosestPanel = (panels: CardPanel[]): CardPanel | undefined => {
    //     const now = getNowAsMsFrommidnight();
    //     return panels.find((panel) => panel.arrivalTime - now > 0);
    // }
    //
    // useEffect(() => {
    //     const closestPanel = findClosestPanel(panels);
    //     if (closestPanel) {
    //         setCountdown({toTime: closestPanel.arrivalTime, message: `Next panel: ${closestPanel.number}`});
    //     }
    // }, [panels]);



    // /temporary

    useEffect(() => {
        subscribe('countdown', (data) => {
            console.log('countdown recived', data);
            setCountdown(data);
        });
    }, [subscribe]);

    useEffect(() => {
        const persistedCardInfo = localStorage.getItem('cardInfo');
        if (persistedCardInfo) {
            try {
                const cardInfo = JSON.parse(persistedCardInfo);
                setCardInfo(cardInfo);
            } catch (e) {
                console.error('Error parsing persisted cardInfo', e);
                setCardInfo(defaultCardContext.cardInfo);
            }
        } else {
            setCardInfo(defaultCardContext.cardInfo);
        }

        const persistedPanels = localStorage.getItem('panels');
        if (persistedPanels) {
            try {
                const panels = JSON.parse(persistedPanels);
                if (Array.isArray(panels)) {
                    setPanels(panels);
                }
            } catch (e) {
                console.error('Error parsing persisted panels', e);
                setPanels(defaultCardContext.panels);
            }
        } else {
            setPanels(defaultCardContext.panels);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (loading) {
            return;
        }
        postMessage('cardInfo', cardInfo);
        localStorage.setItem('cardInfo', JSON.stringify(cardInfo));
    }, [cardInfo, loading]);

    useEffect(() => {
        if (loading) {
            return;
        }
        postMessage('panels', panels);
        localStorage.setItem('panels', JSON.stringify(panels));
    }, [panels, loading]);

    return (
        <CardContext.Provider value={
            {
                loading,
                cardInfo,
                panels,
                countdown,
                updateCardInfo,
                updatePanels,
                updatePanelByNumber
            }
        }>
            {children}
        </CardContext.Provider>
    )
}
