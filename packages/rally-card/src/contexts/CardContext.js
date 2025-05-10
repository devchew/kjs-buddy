import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const defaultCardContext = {
    cardInfo: {
        name: 'Rally example',
        cardNumber: 1,
        carNumber: 69,
        date: '2021-09-01',
        logo: '',
        sponsorLogo: '',
    },
    panels: [],
    updateCard: () => { },
    updateCardInfo: () => { },
    updatePanels: () => { },
    updatePanelByNumber: () => { },
    addPanel: () => { },
    deletePanel: () => { },
    updatePanelName: () => { },
    id: '',
    setId: () => { },
    unloadCard: () => { },
    isEditMode: false,
    setIsEditMode: () => { },
};
const CardContext = createContext(defaultCardContext);
export const useCardContext = () => {
    const context = useContext(CardContext);
    if (!context) {
        throw new Error('useCardContext must be used within a CardProvider');
    }
    return context;
};
export const CardProvider = ({ children }) => {
    const [cardInfo, setCardInfo] = useState(defaultCardContext.cardInfo);
    const [panels, setPanels] = useState(defaultCardContext.panels);
    const [id, setId] = useState(defaultCardContext.id);
    const [isEditMode, setIsEditMode] = useState(false);
    const updateCardInfo = (cardInfo) => setCardInfo(cardInfo);
    const updatePanels = (panels) => setPanels(panels);
    const updatePanelByNumber = (panelNumber, panel) => setPanels(panels.map((p) => p.number === panelNumber ? panel : p));
    const updateCard = (card) => {
        setCardInfo(card.cardInfo);
        setPanels(card.panels);
        setId(card.id);
    };
    // Add a new panel to the existing panels
    const addPanel = () => {
        const newPanelNumber = panels.length > 0 ? Math.max(...panels.map(p => p.number)) + 1 : 1;
        const lastPanel = panels.length > 0 ? panels[panels.length - 1] : null;
        const newPanel = {
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
    const deletePanel = (panelNumber) => {
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
    const updatePanelName = (panelNumber, name) => {
        setPanels(panels.map(panel => panel.number === panelNumber
            ? { ...panel, name }
            : panel));
    };
    // Unload card
    const unloadCard = () => {
        setCardInfo(defaultCardContext.cardInfo);
        setPanels(defaultCardContext.panels);
        setId(defaultCardContext.id);
    };
    return (_jsx(CardContext.Provider, { value: {
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
        }, children: children }));
};
