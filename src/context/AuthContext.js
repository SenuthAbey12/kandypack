import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, role: 'customer'|'admin' }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userType = localStorage.getItem('userType');
    const name = localStorage.getItem('userName') || '';

    if (isAuthenticated && userType) {
      setUser({ id: 'local', name, role: userType });
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    // Demo credentials
    const validCredentials = {
      admin: {
        username: 'admin',
        password: 'admin123',
        name: 'Admin User'
      },
      customer: {
        username: 'customer',
        password: 'customer123',
        name: 'John Doe'
      }
    };

    const creds = validCredentials[role];
    
    if (!creds || username !== creds.username || password !== creds.password) {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', role);
    localStorage.setItem('userName', creds.name);
    setUser({ id: 'local', name: creds.name, role });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
