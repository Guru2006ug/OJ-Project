import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        const response = await api.get('/api/auth/me');
        
        if (mounted && response.status === 200) {
          setIsAuthenticated(true);
        } else {
          throw new Error('Authentication check failed');
        }
      } catch (error) {
        if (mounted) {
          setIsAuthenticated(false);
          if (error.response?.status !== 401) {
            console.error('Auth check failed:', error);
          }
          localStorage.removeItem('token');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuthStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const response = await api.get('/api/auth/me');
      
      setIsAuthenticated(true);
    } catch (error) {
      // Don't log error for 401 - it's expected when not logged in
      if (error.response?.status !== 401) {
        console.error('Auth check failed:', error);
      }
      setIsAuthenticated(false);
      localStorage.removeItem('token'); // Clear any invalid token
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
