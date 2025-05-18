import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
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

const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  authClient: createAuthClient(null),
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create the authenticated client with the current token
  const authClient = useMemo(() => {
    const client = createAuthClient(token);
    client.use({
      onResponse: ({ response }) => {
        if (response.status === 401) {
          logout();
        }
      },
    });

    return client;
  }, [token]);

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

  // Login function
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

  // Register function
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

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("auth-user");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
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
