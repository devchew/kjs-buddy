import { useState, useEffect } from 'react';
import { PredefinedCard, PredefinedCardsData } from '../types/PredefinedCards';
import predefinedCardsData from '../data/predefinedCards.json';
import monte from "../assets/montecalvaria.png";
import pzm from "../assets/pzmot.png";
import { CardInfo } from '../types/Event';

export const usePredefinedCards = () => {
  const [predefinedCards, setPredefinedCards] = useState<PredefinedCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app with API, this would be a fetch request
    // For now, we're loading from the local JSON file

    try {
      // Process the cards to include actual image references instead of just filenames
      const cards = (predefinedCardsData as PredefinedCardsData).predefinedCards.map(card => {
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        
        // Process the card info to include proper image references
        const cardInfo: CardInfo = {
          ...card.cardInfo,
          date: today, // Set today's date by default
          logo: card.cardInfo.logo === "montecalvaria.png" ? monte : card.cardInfo.logo,
          sponsorLogo: card.cardInfo.sponsorLogo === "pzmot.png" ? pzm : card.cardInfo.sponsorLogo
        };

        return {
          ...card,
          cardInfo
        };
      });

      setPredefinedCards(cards);
      setLoading(false);
    } catch (error) {
      console.error("Error loading predefined cards:", error);
      setPredefinedCards([]);
      setLoading(false);
    }
  }, []);

  return { predefinedCards, loading };
};