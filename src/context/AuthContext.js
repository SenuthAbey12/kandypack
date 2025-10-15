import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI, handleAPIError } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.warn('Failed to parse stored user', err);
      return null;
    }
  }); // { id, name, role: 'customer'|'admin'|'driver'|'assistant', portalType: 'customer'|'employee' }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.verify();
          const verifiedUser = response.data.user;
          setUser(verifiedUser);
          localStorage.setItem('user', JSON.stringify(verifiedUser));
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password, role, portalType = 'auto') => {
    try {
      const response = await authAPI.login({ username, password, role, portalType });
      const { user: userData, token } = response.data;
      
      // Determine portal type based on role if not specified
      const finalPortalType = portalType === 'auto' 
        ? (userData.role === 'customer' ? 'customer' : 'employee')
        : portalType;
      
      const userWithPortal = { ...userData, portalType: finalPortalType };
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithPortal));
      setUser(userWithPortal);
      
      return userWithPortal;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const register = async (userData, portalType = 'customer') => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, token } = response.data;
      
      const userWithPortal = { ...newUser, role: 'customer', portalType: 'customer' };
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithPortal));
      setUser(userWithPortal);
      
      return userWithPortal;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateUser = async (userData) => {
    try {
      // Here you would typically make an API call to update user data
      // For now, we'll just update the local state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value = useMemo(() => ({ 
    user, 
    loading, 
    login, 
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    isDriver: user?.role === 'driver',
    isAssistant: user?.role === 'assistant',
    isEmployee: user?.portalType === 'employee',
    portalType: user?.portalType || null
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
