import { createContext, FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { monteCalvaria } from './MonteCalvaria.ts';
import { CardInfo, CardPanel, EventDetails } from '../types/Event.ts';
import { defaultEvent } from './defaultEvent.ts';

export type CardContextType = EventDetails &{
    loading: boolean;
    updateCardInfo: (cardInfo: CardInfo) => void;
    updatePanels: (panels: CardPanel[]) => void;
    updatePanelByNumber: (panelNumber: number, panel: CardPanel) => void;
}


const defaultCardContext: CardContextType = {
    loading: false,
    ...defaultEvent,
    updateCardInfo: () => {},
    updatePanels: () => {},
    updatePanelByNumber: () => {},
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
    const [loading, setLoading] = useState(true);
    const [cardInfo, setCardInfo] = useState<CardInfo>(defaultCardContext.cardInfo);
    const [panels, setPanels] = useState<CardPanel[]>(defaultCardContext.panels);

    const updateCardInfo = (cardInfo: CardInfo) => setCardInfo(cardInfo);
    const updatePanels = (panels: CardPanel[]) => setPanels(panels);
    const updatePanelByNumber = (panelNumber: number, panel: CardPanel) => setPanels(panels.map((p) => p.number === panelNumber ? panel : p));


    useEffect(() => {
        setCardInfo(monteCalvaria.cardInfo);
        setPanels(monteCalvaria.panels);
        setLoading(false);
    }, []);

    return (
        <CardContext.Provider value={{ loading, cardInfo, panels, updateCardInfo, updatePanels, updatePanelByNumber }}>
            {children}
        </CardContext.Provider>
    )
}
