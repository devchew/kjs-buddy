# Card Management

## Overview

The Card Management system is a core feature of KJS Buddy that enables users to create, store, update, and delete rally time cards. The system provides a flexible data structure for representing rally cards with multiple panels (time control points) and implements a robust synchronization mechanism that works seamlessly across different devices.

## Card Data Structure

### Card Components

A complete card in KJS Buddy consists of the following main components:

```typescript
// Card information
type CardInfo = {
    name: string;            // Name of the card/rally event
    cardNumber: number;      // ID number assigned to the card
    carNumber: number;       // Competitor's car number
    date: string;            // Date of the event in ISO format
    logo: string;            // URL or base64 data for the event logo
    sponsorLogo: string;     // URL or base64 data for sponsor logo
}

// Panel data representing a time control point
type CardPanel = {
    number: number;           // Panel sequence number
    name: string;             // Panel name/identifier (e.g., "PS1")
    finishTime: number;       // Finish time in milliseconds from midnight
    provisionalStartTime: number; // Planned start time
    actualStartTime: number;  // Actual start time
    drivingTime: number;      // Time taken to complete the section
    resultTime: number;       // Result time for the panel
    nextPKCTime: number;      // Time of next time control point
    arrivalTime: number;      // Arrival time
}

// Complete card structure
type Card = {
    cardInfo: CardInfo;       // Card general information
    panels: CardPanel[];      // Array of time control panels
    id: string;               // Unique identifier for the card
}

// Card with additional metadata for storage
type StoredCard = Card & {
    lastUsed: number;         // Timestamp of last modification
}
```

### Card Storage Context

The application uses a context-based approach to provide card management functionality throughout the app:

```tsx
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

  // Card management functions...

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
```

## Card Management Operations

### Creating Cards

New cards are created with a unique ID and timestamp:

```typescript
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
```

The `createCard` function:
1. Generates a new card with current timestamp
2. Saves it to storage (local and server if authenticated)
3. Updates the local card state
4. Returns the newly created card

### Reading Cards

Cards can be retrieved individually by ID or as a complete list:

```typescript
const getCard = (id: string) => storage.getCard(id);
```

The `getCard` function attempts to:
1. Find the card in local storage first
2. If not found and the user is authenticated, fetch from server
3. Return the card if found or undefined if not available

### Updating Cards

Cards can be modified with new information while preserving their ID:

```typescript
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
```

The `updateCard` function:
1. Creates an updated card with current timestamp
2. Saves it to storage (local and server if authenticated)
3. Updates the local state with the new version
4. Returns the updated card

### Deleting Cards

Cards can be removed from both local storage and server:

```typescript
const deleteCard = (id: string) =>
  storage.deleteCard(id).then(() => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  });
```

The `deleteCard` function:
1. Removes the card from storage
2. Updates the local state by filtering out the deleted card

## Card Synchronization

The application implements a sophisticated synchronization mechanism that keeps card data in sync across devices for authenticated users.

### Hybrid Storage Approach

Cards are stored both locally and on the server for authenticated users:

```typescript
export const useCardsSharedStorage = () => {
  const http = useHttpClient();
  const { isAuthenticated } = useAuth();

  const localStorageKey = "cardsStorage";

  // Implementation of storage functions...

  return {
    syncCards,
    getCards,
    createCard,
    updateCard,
    deleteCard,
    getCard,
  };
};
```

### Conflict Resolution

When synchronizing cards between local storage and server, the system resolves conflicts based on timestamps:

```typescript
const resolveConflictCard = (
  localCard: StoredCard,
  serverCard: StoredCard,
): StoredCard => {
  const serverCardAge = serverCard.lastUsed;
  const localCardAge = localCard.lastUsed;

  if (serverCardAge > localCardAge) {
    // Server card is newer, use it
    return serverCard;
  }

  return localCard;
};
```

### Merging Strategy

The system employs a sophisticated merging strategy to combine local and server cards:

```typescript
const mergeLocalCardsWithServerCards = (
  localCards: StoredCard[],
  serverCards: CardResponse[],
): StoredCard[] => {
  const mergedCards = new Map<string, StoredCard>();
  
  localCards.forEach((card) => mergedCards.set(card.id, card));
  
  const transformedServerCards = serverCards.map(serverCardToStoredCard);

  transformedServerCards.forEach((serverCard) => {
    if (mergedCards.has(serverCard.id)) {
      const localCard = mergedCards.get(serverCard.id)!;
      mergedCards.set(
        serverCard.id,
        resolveConflictCard(localCard, serverCard),
      );
    } else {
      mergedCards.set(serverCard.id, serverCard);
    }
  });

  return Array.from(mergedCards.values()).sort(
    (a, b) => b.lastUsed - a.lastUsed,
  );
};
```

This merging strategy:
1. Creates a map of local cards keyed by ID
2. Transforms server cards to the local format
3. For each server card:
   - If a local version exists, resolve any conflicts
   - If no local version exists, add the server card
4. Return the merged cards sorted by last usage date

## Card Editing

The application provides specialized functionality for editing cards through the `CardContext`:

```tsx
export const CardProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [cardInfo, setCardInfo] = useState<CardInfo>(defaultCardContext.cardInfo);
  const [panels, setPanels] = useState<CardPanel[]>(defaultCardContext.panels);
  const [id, setId] = useState<string>(defaultCardContext.id);
  const [isEditMode, setIsEditMode] = useState(false);

  // Card update functions...
  
  // Add a new panel to the existing panels
  const addPanel = () => {
    const newPanelNumber = panels.length > 0 ? Math.max(...panels.map(p => p.number)) + 1 : 1;
    const lastPanel = panels.length > 0 ? panels[panels.length - 1] : null;

    const newPanel: CardPanel = {
      number: newPanelNumber,
      name: `PS${newPanelNumber - 1}`,
      finishTime: 0,
      provisionalStartTime: lastPanel ? lastPanel.actualStartTime + lastPanel.drivingTime : 34200000,
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
    // Implementation...
  };

  // Update panel name
  const updatePanelName = (panelNumber: number, name: string) => {
    // Implementation...
  };

  return (
    <CardContext.Provider value={{
      cardInfo,
      panels,
      id,
      // Other values and functions...
    }}>
      {children}
    </CardContext.Provider>
  );
}
```

## Card Templates

KJS Buddy supports card templates to facilitate rapid creation of new cards:

1. **Public Templates**: Available to all users without authentication
2. **Private Templates**: Created by and available only to their owner

Templates are managed through dedicated API endpoints:
- `GET /cards/templates`: Get all public templates
- `GET /cards/templates/{id}`: Get a specific template
- `POST /cards/templates/create`: Create a new template
- `PUT /cards/templates/{id}`: Update a template
- `DELETE /cards/templates/{id}`: Delete a template

## Background Synchronization

The application implements a background synchronization component that ensures card data remains up-to-date:

```tsx
export const BackgroundSync = () => {
  const { updateCard } = useCardContext();

  useEffect(() => {
    const currentCard = localStorage.getItem("currentCard");
    if (!currentCard) {
      return;
    }
    try {
      const card = JSON.parse(currentCard) as {
        cardInfo: CardInfo;
        panels: CardPanel[];
        id: string;
      };
      updateCard(card);
    } catch (e) {
      // Failed to parse card from localStorage
    }
  }, []);

  return null;
};
```

This component:
1. Runs automatically when the application loads
2. Checks for any card data stored in localStorage
3. Updates the current card context with the stored data

## Usage Examples

### Creating a New Card

```tsx
const CardCreatePage = () => {
  const navigate = useNavigate();
  const { saveCard } = useCardsStore();
  const { cardInfo, panels, updateCardInfo } = useCardContext();

  const handleSaveCard = async () => {
    try {
      const savedCard = await saveCard(cardInfo, panels);
      navigate(`/cards/${savedCard.id}`);
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  return (
    <div>
      <h1>Create New Card</h1>
      <CardForm cardInfo={cardInfo} onUpdate={updateCardInfo} />
      <PanelsList panels={panels} />
      <button onClick={handleSaveCard}>Save Card</button>
    </div>
  );
};
```

### Displaying a Card List

```tsx
const CardsListPage = () => {
  const { cards, loading } = useCardsStore();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>My Cards</h1>
      {cards.length === 0 ? (
        <p>No cards found. Create your first card!</p>
      ) : (
        <div className="cards-grid">
          {cards.map(card => (
            <CardPreview 
              key={card.id} 
              id={card.id}
              name={card.cardInfo.name}
              date={card.cardInfo.date}
              lastUsed={new Date(card.lastUsed).toLocaleDateString()}
            />
          ))}
        </div>
      )}
      <Link to="/create">Create New Card</Link>
    </div>
  );
};
```

### Editing a Card

```tsx
const CardEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCard } = useCardsStore();
  const { cardInfo, panels, isEditMode, setIsEditMode } = useCardContext();

  const handleSaveChanges = async () => {
    if (!id) return;
    
    try {
      await updateCard(id, cardInfo, panels);
      setIsEditMode(false);
      navigate(`/cards/${id}`);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  return (
    <div>
      <h1>Edit Card</h1>
      <CardForm cardInfo={cardInfo} isEditable={isEditMode} />
      <PanelsEditor panels={panels} isEditable={isEditMode} />
      <div className="actions">
        <button onClick={handleSaveChanges}>Save Changes</button>
        <button onClick={() => navigate(`/cards/${id}`)}>Cancel</button>
      </div>
    </div>
  );
};
```
