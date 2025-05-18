# Offline Capabilities

## Overview

KJS Buddy is designed as a Progressive Web Application (PWA) with robust offline capabilities, ensuring users can access and use the application even without an internet connection. These capabilities are essential for rally environments where network connectivity is often limited or unavailable.

## Offline Architecture

The offline capabilities in KJS Buddy are implemented through a combination of several technologies and strategies:

1. **Service Worker**: Core technology enabling offline functionality
2. **Local Storage**: Persistent client-side data storage
3. **Cache API**: Resource caching for offline access
4. **IndexedDB**: Structured data storage for complex offline operations
5. **Background Sync**: Synchronization when connection is restored

## Service Worker Caching

KJS Buddy uses the service worker to cache application assets and enable offline access to the application shell:

```typescript
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

// Precache critical assets during installation
precacheAndRoute(self.__WB_MANIFEST);

// Clean old assets to prevent stale content
cleanupOutdatedCaches();

// Enable offline navigation to application routes
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist }),
);
```

### Caching Strategies

Different caching strategies are implemented for various types of resources:

1. **Precaching**: Critical assets are cached during service worker installation
   - Application shell (HTML, CSS, JS)
   - Core application icons
   - Offline fallback pages

2. **Runtime Caching**: Additional resources are cached as they are accessed
   - API responses (with appropriate freshness policies)
   - Dynamic content (with expiration policies)

```typescript
// Example of runtime caching configuration
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Cache images with a Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Cache API requests with a Network First strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);
```

## Local Data Storage

KJS Buddy implements a comprehensive local storage strategy to ensure data availability offline:

### Card Storage

Card data is stored locally to enable full functionality without internet connection:

```typescript
const getLocalCards = (): StoredCard[] => {
  try {
    const storedCards = localStorage.getItem(localStorageKey);
    if (!storedCards) {
      return [];
    }
    const parsedCards = JSON.parse(storedCards) as StoredCard[];
    return parsedCards;
  } catch (e) {
    console.error("Error parsing cards from local storage", e);
    return [];
  }
};
```

### Hybrid Storage Approach

The application uses a hybrid storage approach that prioritizes local data while synchronizing with the server when available:

```typescript
export const useCardsSharedStorage = () => {
  const http = useHttpClient();
  const { isAuthenticated } = useAuth();

  const localStorageKey = "cardsStorage";

  // Local storage functions
  const getLocalCards = (): StoredCard[] => { /* ... */ };
  
  // Get cards with server synchronization if authenticated
  const getCards = useCallback((): Promise<StoredCard[]> => {
    const localCards = getLocalCards();
    if (!isAuthenticated) {
      return Promise.resolve(localCards);
    }
    return http.GET("/cards").then((response) => {
      if (response.error || !response.data) {
        return localCards;
      }
      const newCards = mergeLocalCardsWithServerCards(
        localCards,
        response.data,
      );
      localStorage.setItem(localStorageKey, JSON.stringify(newCards));
      return newCards;
    });
  }, [http, isAuthenticated]);

  // Other storage operations...

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

This approach ensures:
1. Users always have access to their cards, even offline
2. Data is automatically synchronized when online
3. Conflicts are resolved based on timestamps

### Current Card Tracking

The application keeps track of the currently active card to enable seamless resumption of work:

```typescript
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

## IndexedDB for Complex Data

For more complex data structures or larger datasets, KJS Buddy can utilize IndexedDB:

```typescript
// Example IndexedDB implementation for offline data storage
export const useIndexedDBStorage = () => {
  const dbPromise = openDB('kjs-buddy-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('cards')) {
        db.createObjectStore('cards', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('sync-queue')) {
        db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
      }
    }
  });

  const getCards = async () => {
    return (await dbPromise).getAll('cards');
  };

  const saveCard = async (card) => {
    return (await dbPromise).put('cards', card);
  };

  const deleteCard = async (id) => {
    return (await dbPromise).delete('cards', id);
  };

  // Queue operations for background sync
  const queueOperation = async (operation) => {
    return (await dbPromise).add('sync-queue', operation);
  };

  const getQueuedOperations = async () => {
    return (await dbPromise).getAll('sync-queue');
  };

  const clearQueuedOperation = async (id) => {
    return (await dbPromise).delete('sync-queue', id);
  };

  return {
    getCards,
    saveCard,
    deleteCard,
    queueOperation,
    getQueuedOperations,
    clearQueuedOperation
  };
};
```

## Background Synchronization

When network connectivity is restored, KJS Buddy can synchronize changes made offline:

```typescript
// Example background sync implementation
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(registration => {
    // Queue operations when offline
    const queueCardUpdate = async (card) => {
      await storage.queueOperation({
        type: 'UPDATE_CARD',
        data: card
      });
      
      // Register for background sync when possible
      try {
        await registration.sync.register('sync-cards');
      } catch (err) {
        console.error('Background sync registration failed:', err);
      }
    };

    return { queueCardUpdate };
  });
}

// In service worker
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cards') {
    event.waitUntil(syncQueuedOperations());
  }
});

async function syncQueuedOperations() {
  const db = await openDB('kjs-buddy-db', 1);
  const operations = await db.getAll('sync-queue');
  
  for (const op of operations) {
    try {
      // Process operation based on type
      if (op.type === 'UPDATE_CARD') {
        await fetch('/api/cards/' + op.data.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(op.data)
        });
        
        // If successful, remove from queue
        await db.delete('sync-queue', op.id);
      }
      // Handle other operation types...
    } catch (error) {
      console.error('Sync operation failed:', error);
      // Keep in queue for next sync attempt
    }
  }
}
```

## Offline User Experience

KJS Buddy implements several features to optimize the offline user experience:

### 1. Offline Indicators

The application provides visual indicators of network status:

```tsx
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline-indicator">
      <OfflineIcon /> You are currently offline
    </div>
  );
};
```

### 2. Offline-First Design

The application UI is designed to work seamlessly offline:
- All critical functionality available without network connection
- Clear feedback when certain features require connectivity
- Automatic transition between online and offline modes

### 3. Offline Fallback Pages

Custom offline fallback pages are provided when resources cannot be loaded:

```typescript
// Register a specific offline fallback page
registerRoute(
  // Return false for any route you want to handle differently
  ({ request }) => request.mode === 'navigate',
  // Use a Network First strategy
  new NetworkFirst({
    // Fall back to the cache if the network fails
    cacheName: 'pages',
    plugins: [
      // Respond with the offline page if the network is unavailable
      {
        handlerDidError: async () => {
          return caches.match('/offline.html');
        }
      }
    ]
  })
);
```

## PWA Installation

KJS Buddy's offline capabilities include the ability to be installed as a standalone application:

```typescript
// Example install prompt handling
export const useInstallPrompt = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptToInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    // Clear the saved prompt regardless of outcome
    setDeferredPrompt(null);
    setIsInstallable(false);

    return choiceResult.outcome === 'accepted';
  };

  return { isInstallable, promptToInstall };
};
```

This enables:
- Installation on mobile and desktop devices
- Launching from the home screen or app drawer
- Full-screen, app-like experience
- Functioning completely offline after installation

## Data Persistence Strategies

KJS Buddy employs multiple data persistence strategies for different types of data:

1. **LocalStorage**: For simple key-value pairs and small datasets
   - User preferences
   - Current card reference
   - Session information

2. **IndexedDB**: For structured data and larger datasets
   - Complete card library
   - Operation queue for background sync
   - Cached API responses

3. **Cache API**: For HTTP responses and assets
   - Application shell resources
   - Images and media
   - API response caching

## Network Status Monitoring

The application actively monitors network status to adapt its behavior:

```typescript
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<string>('unknown');

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    const updateConnectionQuality = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setConnectionQuality(connection.effectiveType || 'unknown');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateConnectionQuality);
      updateConnectionQuality();
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.removeEventListener('change', updateConnectionQuality);
      }
    };
  }, []);

  return { isOnline, connectionQuality };
};
```

This information is used to:
- Adjust synchronization frequency
- Modify caching strategies
- Adapt UI to network conditions
- Provide appropriate user feedback

## Conflict Resolution

When working offline, data conflicts can arise when reconnecting to the network. KJS Buddy implements a timestamp-based conflict resolution strategy:

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

This ensures:
1. The most recent changes are preserved
2. Data consistency across devices
3. Predictable resolution of conflicts

## Security Considerations

Offline capabilities introduce specific security considerations:

1. **Sensitive Data**: 
   - Personal user data is encrypted when stored offline
   - Option to clear offline data on logout

2. **API Authentication**:
   - Secure token storage for offline authentication
   - Token refresh mechanism when reconnecting

3. **Data Integrity**:
   - Checksums for offline data validation
   - Versioning to prevent outdated data usage

## Testing Offline Mode

KJS Buddy includes specific utilities for testing offline functionality:

```typescript
// Example offline mode testing utility
export const OfflineModeTester = () => {
  const [isTestingOffline, setTestingOffline] = useState(false);
  
  const enableOfflineMode = () => {
    // Simulate offline mode by overriding network requests
    window.addEventListener('fetch', (event) => {
      if (isTestingOffline) {
        event.respondWith(
          new Response('Offline mode active', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        );
      }
    }, { capture: true });
    
    setTestingOffline(true);
  };
  
  const disableOfflineMode = () => {
    setTestingOffline(false);
    // Full implementation would need to remove event listeners
  };
  
  return (
    <div className="offline-tester">
      <h3>Offline Mode Testing</h3>
      <button onClick={isTestingOffline ? disableOfflineMode : enableOfflineMode}>
        {isTestingOffline ? 'Disable Offline Testing' : 'Enable Offline Testing'}
      </button>
      {isTestingOffline && <div className="warning">Offline testing mode active</div>}
    </div>
  );
};
```

This facilitates:
- Testing offline functionality during development
- Verifying sync behavior on reconnection
- Simulating various network conditions
