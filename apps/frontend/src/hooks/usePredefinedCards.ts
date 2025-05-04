import { useState, useEffect } from 'react';
import { client } from '../api';
import { PredefinedCard } from '../types/Responses';

const loadCardsFromLocalStorage = () => {
  const cards = localStorage.getItem("predefinedCards");
  if (cards) {
    try {
      return JSON.parse(cards) as PredefinedCard[];
    } catch (error) {
      console.error("Error parsing predefined cards from local storage:", error);
      return null;
    }
  }
  return null;
}

const saveCardsToLocalStorage = (cards: PredefinedCard[]) => {
  localStorage.setItem("predefinedCards", JSON.stringify(cards));
}

export const usePredefinedCards = () => {
  const [predefinedCards, setPredefinedCards] = useState<PredefinedCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const localCards = loadCardsFromLocalStorage();
    if (localCards) {
      setPredefinedCards(localCards);
    }
    client.GET("/cards/templates/all").then((response) => {
      if (!response.data) {
        setPredefinedCards([]);
        setLoading(false);
        return;
      }
      const cards = response.data;
      setPredefinedCards(cards);
      saveCardsToLocalStorage(cards); // Save to local storage
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error loading predefined cards:", error);
      setLoading(false);
    });
  }, []);

  return { predefinedCards, loading };
};