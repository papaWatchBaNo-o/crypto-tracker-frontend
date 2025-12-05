import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.me();
        setUser(res.data.user); 
      } catch (err) {
        console.error('Failed to validate token:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const addToLocalWatchlist = (coinId, coinName) => {
    setUser(prev => {
      if (!prev) return prev;
      const exists = prev.watchlist?.some(w => w.coinId === coinId);
      if (exists) return prev;
      return { 
        ...prev, 
        watchlist: [...(prev.watchlist || []), { coinId, coinName }] 
      };
    });
  };

  const removeFromLocalWatchlist = (coinId) => {
    setUser(prev => {
      if (!prev) return prev;
      return { 
        ...prev, 
        watchlist: (prev.watchlist || []).filter(w => w.coinId !== coinId) 
      };
    });
  };

  const value = {
    user,
    addToLocalWatchlist,
    removeFromLocalWatchlist,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};