import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';

interface User {
  id: string;
  username: string;
  email: string;
  token: string; // Change to string
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem('foodgram_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('foodgram_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginUser({ email, password });
      
      // TODO: Replace with actual token from backend
      const mockToken = 'mock-jwt-token-' + Date.now(); // Temporary mock token
      const userData = {
        id: response.id || 'user-' + Date.now(),
        username: response.username || email.split('@')[0],
        email: response.email || email,
        token: mockToken,
      };
      
      setUser(userData);
      localStorage.setItem('foodgram_user', JSON.stringify(userData));
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await registerUser({ username, email, password });
      
      // After successful registration, login the user
      await login(email, password);
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      localStorage.removeItem('foodgram_user');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}