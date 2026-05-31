import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeRole, setActiveRole] = useState('freelancer'); // 'freelancer' or 'client'
  const [authLoading, setAuthLoading] = useState(true);

  // Helper to clear frontend authentication state
  const clearAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('activeRole');
  };

  // Restore and validate session from backend on mount
  useEffect(() => {
    const validateSession = async () => {
      const role = localStorage.getItem('activeRole');
      const storedUser = localStorage.getItem('user');

      // No stored session — skip the network call entirely
      if (!storedUser) {
        setAuthLoading(false);
        return;
      }

      try {
        const freshUser = await api.get('/auth/me');
        setUser(freshUser);
        setIsAuthenticated(true);
        setActiveRole(role || freshUser.role || 'freelancer');
        localStorage.setItem('user', JSON.stringify(freshUser));
      } catch {
        // Cookie expired or invalid — silently clear state
        clearAuthState();
      } finally {
        setAuthLoading(false);
      }
    };
    validateSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setActiveRole(userData.role || 'freelancer');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('activeRole', userData.role || 'freelancer');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout call failed:', error);
    }
    clearAuthState();
  };

  const toggleRole = () => {
    const nextRole = activeRole === 'freelancer' ? 'client' : 'freelancer';
    setActiveRole(nextRole);
    localStorage.setItem('activeRole', nextRole);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, activeRole, authLoading, login, logout, toggleRole }}>
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
