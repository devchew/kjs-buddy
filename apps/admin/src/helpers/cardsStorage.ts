import { useAuth } from "../contexts/AuthContext";
import { useHttpClient } from "../hooks/useHttpClient";
import { StoredCard } from "../types/CardsStore";
import { v4 as uuidv4 } from 'uuid';
import { CardResponse } from "../types/Responses";
import { useCallback } from "react";


const serverCardToStoredCard = (card: CardResponse): StoredCard => {
  const {id, panels, lastUsed, ...info} = card;
  return {
    id,
    cardInfo: info,
    panels,
    lastUsed
  };
}

const resolveConflictCard = (localCard: StoredCard, serverCard: StoredCard): StoredCard => {
  const serverCardAge = serverCard.lastUsed;
  const localCardAge = localCard.lastUsed;

  if (serverCardAge > localCardAge ) {
    // Server card is newer, use it
    return serverCard;
  }

  return localCard;
}

const mergeLocalCardsWithServerCards = (localCards: StoredCard[], serverCards: CardResponse[]): StoredCard[] => {
  const mergedCards = new Map<string, StoredCard>();

  localCards.forEach(card => mergedCards.set(card.id, card));

  const transformedServerCards = serverCards.map(serverCardToStoredCard);

  transformedServerCards.forEach(serverCard => {
    if (mergedCards.has(serverCard.id)) {
      const localCard = mergedCards.get(serverCard.id)!;
      mergedCards.set(serverCard.id, resolveConflictCard(localCard, serverCard));
    } else {
      mergedCards.set(serverCard.id, serverCard);
    }
  });

  return Array.from(mergedCards.values()).sort((a, b) => b.lastUsed - a.lastUsed);
};

export const useCardsSharedStorage = () => {
    const http = useHttpClient();
    const { isAuthenticated } = useAuth();

    const localStorageKey = "cardsStorage";

    const getLocalCards = (): StoredCard[] => {
        try {
        const storedCards = localStorage.getItem(localStorageKey);
        if (!storedCards) {
            return [];
        }
        const parsedCards = JSON.parse(storedCards) as StoredCard[];
        return parsedCards;
      } catch (e) {
        console.error('Error parsing cards from local storage', e);
        return [];
      }
    };

    const getCards = useCallback( (): Promise<StoredCard[]> => {
        const localCards = getLocalCards();
        if (!isAuthenticated) {
            return Promise.resolve(localCards);
        }
        return http.GET('/cards')
        .then((response) => {
          if (response.error || !response.data) {
            return localCards;
          }
          const newCards = mergeLocalCardsWithServerCards(localCards, response.data);
          localStorage.setItem(localStorageKey, JSON.stringify(newCards));
          return newCards;
        });
    }, [http, isAuthenticated]);

    const createCard = useCallback( (card: Omit<StoredCard, 'id'>): Promise<StoredCard> => {
        const localCards = getLocalCards();
        const id = uuidv4();
        const newCard = { ...card, lastUsed: Date.now(), id };
        const updatedCards = [...localCards, newCard];

        if (!isAuthenticated) {
            localStorage.setItem(localStorageKey, JSON.stringify(updatedCards));
            return Promise.resolve(newCard);
        }

        return http.POST('/cards', { body: {
            ...newCard.cardInfo,
            panels: newCard.panels,
        } })
        .then((response) => {
            if (response.error || !response.data) {
                console.error('Error creating card on server:', response.error);
                return newCard;
            }
            const serverCard = serverCardToStoredCard(response.data);
            const mergedCards = mergeLocalCardsWithServerCards(updatedCards, [response.data]);
            localStorage.setItem(localStorageKey, JSON.stringify(mergedCards));
            return serverCard;
        })
        .catch((error) => {
            console.error('Error creating card on server:', error);
            return newCard;
        });
    }, [http, isAuthenticated]);

    const updateCard = useCallback( (card: StoredCard): Promise<StoredCard> => {
        const localCards = getLocalCards();
        const updatedCards = localCards.map((c) => {
            if (c.id === card.id) {
                return { ...c, ...card, lastUsed: Date.now() };
            }
            return c;
        });
        localStorage.setItem(localStorageKey, JSON.stringify(updatedCards));

        if (!isAuthenticated) {
            return Promise.resolve(card);
        }

        return http.PUT("/cards/{id}", {
            body: {
                ...card.cardInfo,
                panels: card.panels,
            },
            params: {
                path: {
                    id: card.id
                }
            }
        })
        .then((response) => {
            if (response.error || !response.data) {
                console.error('Error updating card on server:', response.error);
                return card;
            }
            const serverCard = serverCardToStoredCard(response.data);
            return serverCard;
        })
        .catch((error) => {
            console.error('Error updating card on server:', error);
            return card;
        });
    }, [http, isAuthenticated]);

    const deleteCard = useCallback( (id: string): Promise<void> => {
        const localCards = getLocalCards();
        const updatedCards = localCards.filter((c) => c.id !== id);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedCards));

        if (!isAuthenticated) {
            return Promise.resolve();
        }
        return http.DELETE("/cards/{id}", {
            params: {
                path: {
                    id: id
                }
            }
        })
        .then((response) => {
            if (response.error) {
                console.error('Error deleting card on server:', response.error);
            }
        })
        .catch((error) => {
            console.error('Error deleting card on server:', error);
        });
    }, [http, isAuthenticated]);

    const getCard = useCallback( (id: string): Promise<StoredCard | undefined> => {
        const localCards = getLocalCards();
        const card = localCards.find((c) => c.id === id);
        if (!card && isAuthenticated) {
            return http.GET("/cards/{id}", {
                params: {
                    path: {
                        id
                    }
                }
            })
            .then((response) => {
                if (response.error || !response.data) {
                    console.error('Error fetching card from server:', response.error);
                    return undefined;
                }
                return serverCardToStoredCard(response.data);
            })
            .catch((error) => {
                console.error('Error fetching card from server:', error);
                return undefined;
            });
        }
        return Promise.resolve(card);
    }, [http, isAuthenticated]);

    const syncCards = useCallback( (_: StoredCard[]): Promise<void> => {
        // console.log('Syncing cards with server', cards);
        return Promise.resolve();
    }, [http, isAuthenticated]);

    return {
        syncCards,
        getCards,
        createCard,
        updateCard,
        deleteCard,
        getCard,
    };
}
