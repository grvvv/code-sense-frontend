// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { api, tokenManager, handleApiError } from '../config/api';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-logout timer
  const setupAutoLogout = useCallback((token: string) => {
    const expiry = tokenManager.getTokenExpiry(token);
    if (expiry) {
      const timeUntilExpiry = expiry - Date.now();
      
      if (timeUntilExpiry > 0) {
        // Set timeout to logout 1 minute before expiry
        const logoutTimeout = Math.max(timeUntilExpiry - 60000, 0);
        
        setTimeout(() => {
          toast.warning('Your session will expire in 1 minute. Please save your work.');
          
          // Auto-logout after 1 minute warning
          setTimeout(() => {
            logout();
            toast.error('Session expired. Please login again.');
          }, 60000);
        }, logoutTimeout);
      } else {
        // Token already expired
        logout();
      }
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (tokenManager.isTokenExpired(token)) {
        tokenManager.removeToken();
        setLoading(false);
        return;
      }

      // Setup auto-logout timer
      setupAutoLogout(token);

      // Fetch user data
      const response = await api.auth.me();
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      tokenManager.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setupAutoLogout]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      console.log(response.data)
      const { token, user: userData } = response.data;
      
      tokenManager.setToken(token);
      setUser(userData);
      
      // Setup auto-logout timer for new token
      setupAutoLogout(token);
      
      toast.success('Login successful!');
    } catch (error) {
      const errorMessage = handleApiError(error, 'Login failed');
      throw new Error(errorMessage);
    }
  };

  const logout = useCallback(() => {
    // Clear token and user data
    tokenManager.removeToken();
    setUser(null);
    
    // Optional: Call logout endpoint to invalidate token on server
    try {
      api.auth.logout().catch(() => {
        // Ignore logout API errors - token is already removed locally
      });
    } catch {
      // Ignore errors
    }
    
    // Clear any remaining timeouts
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < Number(highestTimeoutId); i++) {
      clearTimeout(i);
    }
  }, []);

  const refreshUserData = async () => {
    try {
      const response = await api.auth.me();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Don't logout here - let the interceptor handle it
    }
  };

  // Listen for storage changes (for multi-tab logout)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && !e.newValue) {
        // Token was removed in another tab
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check token expiry periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const token = tokenManager.getToken();
      if (token && tokenManager.isTokenExpired(token)) {
        logout();
        toast.error('Session expired. Please login again.');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [logout]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for authenticated API calls
export const useAuthenticatedApi = () => {
  const { logout } = useAuth();
  
  const callApi = useCallback(async (apiCall: () => Promise<any>) => {
    try {
      return await apiCall();
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    }
  }, [logout]);

  return callApi;
};