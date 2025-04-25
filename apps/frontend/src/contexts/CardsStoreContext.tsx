import { createContext, FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { CardInfo, CardPanel } from '../types/Event';
import { CardsStore, StoredCard } from '../types/CardsStore';
import { v4 as uuidv4 } from 'uuid';

interface CardsStoreContextType extends CardsStore {
  saveCard: (cardInfo: CardInfo, panels: CardPanel[]) => string;
  getCard: (id: string) => StoredCard | undefined;
  updateCard: (id: string, cardInfo: CardInfo, panels: CardPanel[]) => void;
  deleteCard: (id: string) => void;
  setLastUsedCardId: (id: string) => void;
  loading: boolean;
}

const defaultCardsStore: CardsStore = {
  cards: [],
  lastUsedCardId: null,
};

const CardsStoreContext = createContext<CardsStoreContextType>({
  ...defaultCardsStore,
  saveCard: () => '',
  getCard: () => undefined,
  updateCard: () => {},
  deleteCard: () => {},
  setLastUsedCardId: () => {},
  loading: true,
});

export const useCardsStore = () => {
  const context = useContext(CardsStoreContext);
  if (!context) {
    throw new Error('useCardsStore must be used within a CardsStoreProvider');
  }
  return context;
};

export const CardsStoreProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<StoredCard[]>([]);
  const [lastUsedCardId, setLastUsedCardId] = useState<string | null>(null);

  // Load cards from local storage on first render
  useEffect(() => {
    const storedCards = localStorage.getItem('kjs-buddy-cards');
    if (storedCards) {
      try {
        const parsedCards = JSON.parse(storedCards) as StoredCard[];
        setCards(parsedCards);
      } catch (e) {
        console.error('Error parsing stored cards', e);
        setCards([]);
      }
    }

    const lastCardId = localStorage.getItem('kjs-buddy-last-card-id');
    if (lastCardId) {
      setLastUsedCardId(lastCardId);
    }

    setLoading(false);
  }, []);

  // Save cards to local storage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('kjs-buddy-cards', JSON.stringify(cards));
    }
  }, [cards, loading]);

  // Save last used card ID to local storage whenever it changes
  useEffect(() => {
    if (!loading && lastUsedCardId) {
      localStorage.setItem('kjs-buddy-last-card-id', lastUsedCardId);
    }
  }, [lastUsedCardId, loading]);

  const saveCard = (cardInfo: CardInfo, panels: CardPanel[]): string => {
    const id = uuidv4();
    const newCard: StoredCard = {
      id,
      cardInfo,
      panels,
      lastUsed: Date.now(),
    };

    setCards((prevCards) => [...prevCards, newCard]);
    setLastUsedCardId(id);
    return id;
  };

  const getCard = (id: string): StoredCard | undefined => {
    const card = cards.find((c) => c.id === id);
    if (card) {
      // Update last used time
      const updatedCard = { ...card, lastUsed: Date.now() };
      setCards((prevCards) => 
        prevCards.map((c) => (c.id === id ? updatedCard : c))
      );
      setLastUsedCardId(id);
      return updatedCard;
    }
    return undefined;
  };

  const updateCard = (id: string, cardInfo: CardInfo, panels: CardPanel[]): void => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? { ...card, cardInfo, panels, lastUsed: Date.now() }
          : card
      )
    );
    setLastUsedCardId(id);
  };

  const deleteCard = (id: string): void => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    
    // Update last used card ID if the deleted card was the last used one
    if (lastUsedCardId === id) {
      const remainingCards = cards.filter(card => card.id !== id);
      if (remainingCards.length > 0) {
        // Sort by lastUsed and get the most recent one
        const mostRecentCard = [...remainingCards].sort((a, b) => b.lastUsed - a.lastUsed)[0];
        setLastUsedCardId(mostRecentCard.id);
      } else {
        setLastUsedCardId(null);
      }
    }
  };

  return (
    <CardsStoreContext.Provider
      value={{
        cards,
        lastUsedCardId,
        saveCard,
        getCard,
        updateCard,
        deleteCard,
        setLastUsedCardId,
        loading,
      }}
    >
      {children}
    </CardsStoreContext.Provider>
  );
};