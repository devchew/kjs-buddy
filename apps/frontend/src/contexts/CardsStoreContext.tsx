import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { CardInfo, CardPanel } from "../types/Card";
import { CardsStore, StoredCard } from "../types/CardsStore";
import { useCardsSharedStorage } from "../helpers/cardsStorage";

interface CardsStoreContextType extends CardsStore {
  saveCard: (cardInfo: CardInfo, panels: CardPanel[]) => Promise<StoredCard>;
  getCard: (id: string) => Promise<StoredCard | undefined>;
  updateCard: (
    id: string,
    cardInfo: CardInfo,
    panels: CardPanel[],
  ) => Promise<StoredCard>;
  deleteCard: (id: string) => Promise<void>;
  loading: boolean;
}

const defaultCardsStore: CardsStore = {
  cards: [],
};

const CardsStoreContext = createContext<CardsStoreContextType>({
  ...defaultCardsStore,
  saveCard: () => Promise.resolve({} as StoredCard),
  getCard: () => Promise.resolve(undefined),
  updateCard: () => Promise.resolve({} as StoredCard),
  deleteCard: () => Promise.resolve(),
  loading: true,
});

export const useCardsStore = () => {
  const context = useContext(CardsStoreContext);
  if (!context) {
    throw new Error("useCardsStore must be used within a CardsStoreProvider");
  }
  return context;
};

export const CardsStoreProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<StoredCard[]>([]);
  const storage = useCardsSharedStorage();

  // Load cards from local storage on first render
  useEffect(() => {
    setLoading(true);
    storage
      .getCards()
      .then((cards) => {
        setCards(cards);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setCards, setLoading, storage.getCards]);

  // Save cards to local storage whenever they change
  useEffect(() => {
    if (loading) return;
    storage.syncCards(cards);
  }, [cards, loading]);

  const createCard = (cardInfo: CardInfo, panels: CardPanel[]) =>
    storage
      .createCard({
        cardInfo,
        panels,
        lastUsed: Date.now(),
      })
      .then((updatedCard) => {
        setCards((prevCards) => [...prevCards, updatedCard]);
        return updatedCard;
      });

  const getCard = (id: string) => storage.getCard(id);

  const updateCard = (id: string, cardInfo: CardInfo, panels: CardPanel[]) => {
    return storage
      .updateCard({
        id,
        cardInfo,
        panels,
        lastUsed: Date.now(),
      })
      .then((updatedCard) => {
        setCards((prevCards) =>
          prevCards.map((card) => (card.id === id ? updatedCard : card)),
        );
        return updatedCard;
      });
  };

  const deleteCard = (id: string) =>
    storage.deleteCard(id).then(() => {
      setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    });

  return (
    <CardsStoreContext.Provider
      value={{
        cards,
        saveCard: createCard,
        getCard,
        updateCard,
        deleteCard,
        loading,
      }}
    >
      {children}
    </CardsStoreContext.Provider>
  );
};
