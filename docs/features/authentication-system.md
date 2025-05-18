# Authentication System

## Overview

The authentication system in KJS Buddy provides secure user management with support for email/password authentication and role-based access control. It enables users to synchronize their card data across multiple devices by maintaining a consistent identity across sessions.

## Implementation Details

### Authentication Context

The authentication system is implemented using React's Context API, providing authentication state and methods throughout the application:

```tsx
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { client } from "../api";
import { createAuthClient } from "../api";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  authClient: ReturnType<typeof createAuthClient>;
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create the authenticated client with the current token
  const authClient = useMemo(() => {
    const client = createAuthClient(token);
    // Handle unauthorized responses
    client.use({
      onResponse: ({ response }) => {
        if (response.status === 401) {
          logout();
        }
      },
    });
    return client;
  }, [token]);
  
  // Authentication methods implementation...
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        authClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### Authentication Flow

1. **Session Persistence**

   The authentication state is preserved across browser sessions using sessionStorage:

   ```typescript
   // Check for existing token and user in sessionStorage on mount
   useEffect(() => {
     const storedToken = sessionStorage.getItem("auth-token");
     const storedUser = sessionStorage.getItem("auth-user");

     if (storedToken && storedUser) {
       setToken(storedToken);
       try {
         const parsedUser = JSON.parse(storedUser);
         setUser(parsedUser);
       } catch (e) {
         console.error("Error parsing stored user", e);
         logout();
       }
     }

     setIsLoading(false);
   }, []);
   ```

2. **Login Process**

   The login function authenticates users through the backend API:

   ```typescript
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
   ```

3. **Registration Process**

   New users can register with an email and password:

   ```typescript
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

         // Store in sessionStorage for persistence
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

4. **Logout Process**

   The logout function clears the authentication state:

   ```typescript
   const logout = () => {
     setUser(null);
     setToken(null);
     sessionStorage.removeItem("auth-token");
     sessionStorage.removeItem("auth-user");
   };
   ```

### Role-Based Access Control

The authentication system supports different user roles:

- **User Role**: Standard access for managing personal cards
- **Admin Role**: Extended privileges for system management

User roles are included in the JWT token and stored in the user object:

```typescript
interface User {
  id: string;
  email: string;
  role: string; // "user" or "admin"
}
```

The role information can be used throughout the application to conditionally render components or enable features based on the user's permissions.

### Backend Authentication API

The authentication API endpoints include:

- `POST /auth/login`: Authenticate an existing user
- `POST /auth/register`: Create a new user account
- `GET /auth/profile`: Retrieve the current user's profile
- `PUT /auth/profile`: Update the current user's profile

## Security Considerations

1. **JWT Token Management**
   - Tokens are stored in sessionStorage for the duration of the browser session
   - Tokens include expiration timestamps
   - API calls automatically handle expired tokens

2. **Password Security**
   - Passwords are never stored in plaintext
   - Backend implements secure password hashing
   - Failed login attempts are rate-limited

3. **Session Handling**
   - Sessions are invalidated on logout
   - Authentication state is maintained in memory and sessionStorage
   - Unauthorized API responses trigger automatic logout

## Usage Examples

### Using Authentication in Components

```tsx
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Protected Routes

```tsx
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

### Making Authenticated API Calls

```tsx
import { useAuth } from "../contexts/AuthContext";

const CardsList = () => {
  const { authClient } = useAuth();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const response = await authClient.GET("/cards");
      if (response.data) {
        setCards(response.data);
      }
    };

    fetchCards();
  }, [authClient]);

  return (
    <div>
      <h1>My Cards</h1>
      {cards.map(card => <CardItem key={card.id} card={card} />)}
    </div>
  );
};
```
