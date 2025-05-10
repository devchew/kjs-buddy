import { useCardContext } from '@internal/rally-card';
import { useEffect } from 'react';
import { CardInfo, CardPanel } from '../types/Card.ts';

export const BackgroundSync = () => {
    const { updateCard } = useCardContext();

    useEffect(() => {
        const currentCard = localStorage.getItem('currentCard');
        if (!currentCard) {
            return;
        }
        try {
            const card = JSON.parse(currentCard) as {cardInfo: CardInfo, panels: CardPanel[], id: string};
            console.log('currentCard', card);
            updateCard(card);
        } catch (e) {
            console.error('Error parsing currentCard', e);

        }
    }, []);



    return null;
}
