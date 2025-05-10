import { createContext, type FunctionComponent, type PropsWithChildren, useContext, useState } from 'react';
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
}

const defaultCardContext: CardContextType = {
    cardInfo: {
        name: 'Rally example',
        cardNumber: 1,
        carNumber: 69,
        date: '2021-09-01',
        logo: '',
        sponsorLogo: '',
    },

    panels: [],
    updateCard: () => {},
    updateCardInfo: () => {},
    updatePanels: () => {},
    updatePanelByNumber: () => {},
    addPanel: () => {},
    deletePanel: () => {},
    updatePanelName: () => {},
    id: '',
    setId: () => {},
    unloadCard: () => {},
    isEditMode: false,
    setIsEditMode: () => {},
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
    const [cardInfo, setCardInfo] = useState<CardInfo>(defaultCardContext.cardInfo);
    const [panels, setPanels] = useState<CardPanel[]>(defaultCardContext.panels);
    const [id, setId] = useState<string>(defaultCardContext.id);
    const [isEditMode, setIsEditMode] = useState(false);

    const updateCardInfo = (cardInfo: CardInfo) => setCardInfo(cardInfo);
    const updatePanels = (panels: CardPanel[]) => setPanels(panels);
    const updatePanelByNumber = (panelNumber: number, panel: CardPanel) => setPanels(panels.map((p) => p.number === panelNumber ? panel : p));

    const updateCard = (card: Card) => {
        setCardInfo(card.cardInfo);
        setPanels(card.panels);
        setId(card.id);
    };

    // Add a new panel to the existing panels
    const addPanel = () => {
        const newPanelNumber = panels.length > 0 ? Math.max(...panels.map(p => p.number)) + 1 : 1;
        const lastPanel = panels.length > 0 ? panels[panels.length - 1] : null;

        const newPanel: CardPanel = {
            number: newPanelNumber,
            name: `PS${newPanelNumber - 1}`,
            finishTime: 0,
            provisionalStartTime: lastPanel ? lastPanel.actualStartTime + lastPanel.drivingTime : 34200000, // Use previous panel time or default to 9:30
            actualStartTime: 0,
            drivingTime: 0,
            resultTime: 0,
            nextPKCTime: 0,
            arrivalTime: 0,
        };

        setPanels([...panels, newPanel]);
    };

    // Delete a panel by panel number
    const deletePanel = (panelNumber: number) => {
        // Don't delete the last panel
        if (panels.length <= 1) {
            return;
        }

        // Remove the panel
        const updatedPanels = panels.filter(panel => panel.number !== panelNumber);

        // Renumber the panels to ensure sequential numbering
        const renumberedPanels = updatedPanels.map((panel, index) => ({
            ...panel,
            number: index + 1,
            name: index === 0 ? '' : panel.name // First panel has empty name
        }));

        setPanels(renumberedPanels);
    };

    // Update panel name
    const updatePanelName = (panelNumber: number, name: string) => {
        setPanels(panels.map(panel =>
            panel.number === panelNumber
                ? { ...panel, name }
                : panel
        ));
    };

    // Unload card
    const unloadCard = () => {
        setCardInfo(defaultCardContext.cardInfo);
        setPanels(defaultCardContext.panels);
        setId(defaultCardContext.id);
    };

    return (
        <CardContext.Provider value={
            {
                cardInfo,
                panels,
                id,
                setId,
                updateCard,
                updateCardInfo,
                updatePanels,
                updatePanelByNumber,
                addPanel,
                deletePanel,
                updatePanelName,
                unloadCard,
                isEditMode,
                setIsEditMode,
            }
        }>
            {children}
        </CardContext.Provider>
    )
}
