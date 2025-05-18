# API Integration

## Overview

KJS Buddy's frontend interfaces with a NestJS backend server through a comprehensive RESTful API. This API provides endpoints for authentication, card management, and template operations, enabling seamless data synchronization across devices for authenticated users.

## API Architecture

The API integration in KJS Buddy follows a client-server architecture:

- **Frontend**: React application that consumes API endpoints
- **Backend**: NestJS server that provides RESTful API endpoints
- **API Client**: Custom HTTP client for making API requests
- **Authentication**: JWT-based authentication for secure access

## HTTP Client Implementation

The application uses a custom HTTP client for API communication:

```typescript
// Example HTTP client implementation
import { createClient } from '@kjs-buddy/api-client';

// Base API client for unauthenticated requests
export const client = createClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Create authenticated client with JWT token
export const createAuthClient = (token: string | null) => {
  return createClient({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    defaultHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
};
```

This client:
1. Provides a consistent interface for API requests
2. Handles authentication headers automatically
3. Supports both authenticated and unauthenticated requests
4. Configures the base URL based on environment variables

### HTTP Client Hook

For ease of use within components, the application provides a hook for accessing the HTTP client:

```typescript
// Example useHttpClient hook
import { useAuth } from '../contexts/AuthContext';
import { client } from '../api';

export const useHttpClient = () => {
  const { token, authClient } = useAuth();
  
  // Return authenticated client if token exists, otherwise base client
  return token ? authClient : client;
};
```

This hook:
1. Accesses the authentication context to check for JWT token
2. Returns the appropriate client based on authentication state
3. Ensures all API calls use the correct authentication credentials

## API Endpoints

KJS Buddy's backend provides several categories of endpoints:

### Authentication Endpoints

```typescript
// Authentication API endpoints
const authEndpoints = {
  login: () => '/auth/login',
  register: () => '/auth/register',
  profile: () => '/auth/profile',
  updateProfile: () => '/auth/profile',
};
```

These endpoints handle:
- User registration with email/password
- Login authentication and token generation
- Profile retrieval and updates
- Password management

### Card Endpoints

```typescript
// Card API endpoints
const cardEndpoints = {
  getCards: () => '/cards',
  getCard: (id: string) => `/cards/${id}`,
  createCard: () => '/cards',
  updateCard: (id: string) => `/cards/${id}`,
  deleteCard: (id: string) => `/cards/${id}`,
};
```

These endpoints provide:
- Retrieval of all user cards
- Single card access by ID
- Card creation with validation
- Card updates with conflict resolution
- Card deletion with confirmation

### Template Endpoints

```typescript
// Template API endpoints
const templateEndpoints = {
  getTemplates: () => '/cards/templates',
  getTemplate: (id: string) => `/cards/templates/${id}`,
  createTemplate: () => '/cards/templates/create',
  updateTemplate: (id: string) => `/cards/templates/${id}`,
  deleteTemplate: (id: string) => `/cards/templates/${id}`,
};
```

These endpoints enable:
- Access to public card templates
- User-specific template management
- Template creation from existing cards
- Template updates and sharing
- Template removal

## API Response Structure

The API follows a consistent response structure:

```typescript
// Example API response types
interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

This structure:
1. Provides a consistent format for both success and error responses
2. Includes appropriate metadata with each response
3. Facilitates clear error handling with specific error codes
4. Simplifies frontend integration and response processing

## Authentication Integration

The application integrates with the authentication API through the AuthContext:

```typescript
// Example login implementation in AuthContext
const login = async (email: string, password: string): Promise<void> => {
  setIsLoading(true);

  try {
    const response = await client.POST("/auth/login", {
      body: { email, password },
    });

    if (response.error) {
      throw new Error("Login failed");
    }

    if (response.data) {
      const { access_token, user } = response.data;
      setToken(access_token);
      setUser(user);

      // Store in sessionStorage for persistence
      sessionStorage.setItem("auth-token", access_token);
      sessionStorage.setItem("auth-user", JSON.stringify(user));
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

// Example register implementation
const register = async (email: string, password: string): Promise<void> => {
  setIsLoading(true);

  try {
    const response = await client.POST("/auth/register", {
      body: { email, password },
    });

    if (response.error) {
      throw new Error("Registration failed");
    }

    if (response.data) {
      const { access_token, user } = response.data;
      setToken(access_token);
      setUser(user);

      sessionStorage.setItem("auth-token", access_token);
      sessionStorage.setItem("auth-user", JSON.stringify(user));
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};
```

This integration:
1. Sends credentials to the appropriate endpoints
2. Handles success and error responses
3. Stores authentication data for persistence
4. Updates the application state with user information

## Card Data Synchronization

The application synchronizes card data with the backend through the card storage system:

```typescript
// Example card synchronization in useCardsSharedStorage
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

const createCard = useCallback(
  (card: Omit<StoredCard, "id">): Promise<StoredCard> => {
    const localCards = getLocalCards();
    const id = uuidv4();
    const newCard = { ...card, lastUsed: Date.now(), id };
    const updatedCards = [...localCards, newCard];

    if (!isAuthenticated) {
      localStorage.setItem(localStorageKey, JSON.stringify(updatedCards));
      return Promise.resolve(newCard);
    }

    return http
      .POST("/cards", {
        body: {
          ...newCard.cardInfo,
          panels: newCard.panels,
        },
      })
      .then((response) => {
        if (response.error || !response.data) {
          console.error("Error creating card on server:", response.error);
          return newCard;
        }
        const serverCard = serverCardToStoredCard(response.data);
        const mergedCards = mergeLocalCardsWithServerCards(updatedCards, [
          response.data,
        ]);
        localStorage.setItem(localStorageKey, JSON.stringify(mergedCards));
        return serverCard;
      })
      .catch((error) => {
        console.error("Error creating card on server:", error);
        return newCard;
      });
  },
  [http, isAuthenticated],
);
```

This implementation:
1. Checks authentication status before making API requests
2. Falls back to local storage when offline or not authenticated
3. Merges server data with local data using conflict resolution
4. Updates local storage after successful server operations

## Error Handling

The application implements comprehensive error handling for API interactions:

```typescript
// Example error handling in API requests
const fetchCards = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await http.GET('/cards');
    
    if (response.error) {
      // Handle specific error codes
      switch (response.error.code) {
        case 'UNAUTHORIZED':
          setError('Please log in to access your cards');
          break;
        case 'RATE_LIMIT_EXCEEDED':
          setError('Too many requests. Please try again later');
          break;
        default:
          setError(`Failed to fetch cards: ${response.error.message}`);
      }
      return;
    }
    
    setCards(response.data || []);
  } catch (error) {
    // Handle network or unexpected errors
    console.error('Error fetching cards:', error);
    setError('Network error. Please check your connection');
  } finally {
    setLoading(false);
  }
};
```

This approach:
1. Categorizes errors based on error codes
2. Provides user-friendly error messages
3. Handles both API and network errors
4. Maintains UI state during error conditions

## Retry Logic

For operations that may fail due to network issues, KJS Buddy implements retry logic:

```typescript
// Example retry logic implementation
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Attempt the operation
      return await operation();
    } catch (error) {
      // Save the error for potential rethrowing
      lastError = error as Error;
      
      // Check if we should retry
      if (attempt < maxRetries - 1) {
        // Wait with exponential backoff
        const waitTime = delay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed. Retrying in ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // All retries failed
  throw lastError || new Error('Operation failed after maximum retries');
};

// Usage example
const syncCard = async (card: Card) => {
  return withRetry(
    () => http.PUT(`/cards/${card.id}`, { body: card }),
    3,
    500
  );
};
```

This utility:
1. Attempts the operation multiple times
2. Implements exponential backoff for progressive delays
3. Preserves and rethrows the original error after all retries fail
4. Improves resilience to intermittent network issues

## API Documentation Integration

KJS Buddy's backend provides Swagger documentation that the frontend can access:

```typescript
// Example API documentation access
export const ApiDocsLink: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const docsUrl = `${baseUrl}/api/docs`;
  
  return (
    <div className="api-docs-link">
      <a href={docsUrl} target="_blank" rel="noopener noreferrer">
        API Documentation
      </a>
    </div>
  );
};
```

The Swagger documentation is configured in the backend:

```typescript
// From backend main.ts
const config = new DocumentBuilder()
  .setTitle('KJS Buddy API')
  .setDescription('API documentation for KJS Buddy application')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

This documentation:
1. Provides interactive API reference
2. Includes authentication requirements
3. Details request and response formats
4. Allows API testing directly from the browser

## Request Types

The API client supports various types of requests:

```typescript
// Example HTTP client method usage
export const fetchUserCards = () => {
  return http.GET('/cards');
};

export const createUserCard = (card: CardData) => {
  return http.POST('/cards', { body: card });
};

export const updateUserCard = (id: string, card: CardData) => {
  return http.PUT(`/cards/${id}`, { body: card });
};

export const deleteUserCard = (id: string) => {
  return http.DELETE(`/cards/${id}`);
};

export const searchCards = (query: string) => {
  return http.GET('/cards/search', { 
    params: { query }
  });
};
```

These methods:
1. Encapsulate API endpoint details
2. Handle request formatting
3. Pass appropriate parameters
4. Return consistent response objects

## Request Interceptors

KJS Buddy's API client supports interceptors for cross-cutting concerns:

```typescript
// Example request interceptors
http.use({
  onRequest: ({ request }) => {
    // Add timestamp to all requests
    request.headers['X-Request-Time'] = Date.now().toString();
    
    // Add application version
    const appVersion = localStorage.getItem('app_version');
    if (appVersion) {
      request.headers['X-App-Version'] = appVersion;
    }
    
    return request;
  },
  
  onResponse: ({ response }) => {
    // Log API response times
    const requestTime = Number(response.headers.get('X-Request-Time') || '0');
    const responseTime = Date.now();
    
    if (requestTime > 0) {
      const duration = responseTime - requestTime;
      console.debug(`API call took ${duration}ms:`, response.url);
    }
    
    return response;
  },
  
  onError: ({ error }) => {
    // Log API errors
    console.error('API Error:', error);
    
    // Additional error processing
    return error;
  }
});
```

These interceptors:
1. Add common headers to all requests
2. Measure and log API response times
3. Centralize error logging
4. Provide extension points for cross-cutting concerns

## Mock API for Development

During development, KJS Buddy can use a mock API for testing:

```typescript
// Example mock API implementation
export const createMockClient = () => {
  // In-memory data store
  const cards: Record<string, StoredCard> = {};
  
  return {
    GET: async (path: string) => {
      await simulateNetworkDelay();
      
      if (path === '/cards') {
        return { data: Object.values(cards) };
      }
      
      const match = path.match(/\/cards\/(.+)/);
      if (match && match[1]) {
        const cardId = match[1];
        if (cards[cardId]) {
          return { data: cards[cardId] };
        } else {
          return { error: { code: 'NOT_FOUND', message: 'Card not found' } };
        }
      }
      
      return { error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
    },
    
    POST: async (path: string, { body }: any) => {
      await simulateNetworkDelay();
      
      if (path === '/cards') {
        const id = `card-${Date.now()}`;
        const newCard = {
          id,
          cardInfo: body.cardInfo || body,
          panels: body.panels || [],
          lastUsed: Date.now()
        };
        
        cards[id] = newCard;
        return { data: newCard };
      }
      
      return { error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
    },
    
    PUT: async (path: string, { body }: any) => {
      await simulateNetworkDelay();
      
      const match = path.match(/\/cards\/(.+)/);
      if (match && match[1]) {
        const cardId = match[1];
        if (cards[cardId]) {
          cards[cardId] = {
            ...cards[cardId],
            ...body,
            lastUsed: Date.now()
          };
          return { data: cards[cardId] };
        } else {
          return { error: { code: 'NOT_FOUND', message: 'Card not found' } };
        }
      }
      
      return { error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
    },
    
    DELETE: async (path: string) => {
      await simulateNetworkDelay();
      
      const match = path.match(/\/cards\/(.+)/);
      if (match && match[1]) {
        const cardId = match[1];
        if (cards[cardId]) {
          delete cards[cardId];
          return { data: { success: true } };
        } else {
          return { error: { code: 'NOT_FOUND', message: 'Card not found' } };
        }
      }
      
      return { error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
    }
  };
};

// Helper to simulate network latency
const simulateNetworkDelay = () => {
  const delay = Math.random() * 300 + 100; // 100-400ms delay
  return new Promise(resolve => setTimeout(resolve, delay));
};
```

This mock implementation:
1. Simulates API behavior without a backend
2. Stores data in memory for the session
3. Includes realistic network delays
4. Supports the same interface as the real API client

## WebSocket Integration

For real-time updates, KJS Buddy can integrate with WebSocket endpoints:

```typescript
// Example WebSocket client implementation
export const useWebSocketClient = () => {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/events';
    
    // Create authenticated WebSocket connection
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connection established');
      
      // Authenticate the connection if we have a token
      if (token) {
        socket.send(JSON.stringify({ type: 'authenticate', token }));
      }
    };
    
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
        
        // Handle specific message types
        if (message.type === 'card_updated') {
          // Handle card update notification
        } else if (message.type === 'notification') {
          // Handle notification message
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket connection closed');
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    socketRef.current = socket;
    
    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, [token]);
  
  // Function to send messages to the server
  const sendMessage = (messageData: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(messageData));
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  };
  
  return { isConnected, messages, sendMessage };
};
```

This WebSocket integration:
1. Establishes a real-time connection to the server
2. Authenticates using the same JWT token
3. Handles various message types for different events
4. Provides a simple interface for sending messages

## CORS Configuration

KJS Buddy's backend includes CORS configuration to allow API access from the frontend:

```typescript
// From backend main.ts
// Enable CORS with configuration from environment
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:7777'];

app.enableCors({
  origin: corsOrigins,
  credentials: true,
});
```

This configuration:
1. Allows requests from specified origins
2. Permits credentials to be included in requests
3. Ensures secure cross-origin communication
4. Configurable through environment variables

## API Versioning

For future compatibility, KJS Buddy supports API versioning:

```typescript
// Example versioned API client
export const createApiClient = (version = 'v1') => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const apiBase = `${baseUrl}/api/${version}`;
  
  return createClient({
    baseUrl: apiBase,
    defaultHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
};

// Usage example
const v1Client = createApiClient('v1');
const v2Client = createApiClient('v2');

// Function to get appropriate client based on feature flags
const getApiClient = (feature: string) => {
  const featureVersionMap: Record<string, string> = {
    'advanced-search': 'v2',
    'card-templates': 'v2',
    'default': 'v1'
  };
  
  const version = featureVersionMap[feature] || featureVersionMap.default;
  return createApiClient(version);
};
```

This approach:
1. Supports multiple API versions simultaneously
2. Allows gradual migration to newer API versions
3. Enables feature-specific API version selection
4. Maintains backward compatibility

## Rate Limiting

The frontend handles rate limiting from the API:

```typescript
// Example rate limit handling
const apiCallWithRateLimit = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();
    
    if (response.error?.code === 'RATE_LIMIT_EXCEEDED') {
      // Extract retry-after header if available
      const retryAfter = parseInt(response.headers?.['retry-after'] || '5', 10);
      
      // Show rate limit notification
      showNotification({
        type: 'warning',
        message: 'Rate limit exceeded',
        description: `Please try again after ${retryAfter} seconds`,
      });
      
      // Store rate limit info
      setRateLimitInfo({
        limited: true,
        retryAfter,
        limitedUntil: Date.now() + (retryAfter * 1000),
      });
    }
    
    return response;
  } catch (error) {
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: { originalError: error }
      }
    };
  }
};
```

This implementation:
1. Captures rate limit responses from the API
2. Extracts retry timing information
3. Provides user feedback about the rate limit
4. Manages rate limit state for UI adaptation

## API Usage Analytics

KJS Buddy tracks API usage for performance monitoring:

```typescript
// Example API analytics implementation
const trackApiCall = (endpoint: string, duration: number, success: boolean) => {
  // Add to local analytics queue
  apiAnalytics.push({
    endpoint,
    duration,
    success,
    timestamp: Date.now(),
  });
  
  // Periodically send analytics data
  if (apiAnalytics.length >= 10 || lastAnalyticsSent < Date.now() - 60000) {
    sendApiAnalytics();
  }
};

const sendApiAnalytics = async () => {
  if (apiAnalytics.length === 0) return;
  
  try {
    const analytics = [...apiAnalytics];
    apiAnalytics = [];
    lastAnalyticsSent = Date.now();
    
    // Send analytics data
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: analytics }),
      // Use keepalive to ensure request completes even during page unload
      keepalive: true,
    });
  } catch (error) {
    console.error('Failed to send API analytics:', error);
    // Re-add analytics data for retry
    apiAnalytics = [...apiAnalytics, ...analytics];
  }
};
```

This tracking:
1. Measures API call performance
2. Tracks success and failure rates
3. Batches analytics data for efficient transmission
4. Ensures data delivery even during page navigation
