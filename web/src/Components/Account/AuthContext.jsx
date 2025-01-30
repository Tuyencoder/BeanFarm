import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('id'));

  useEffect(() => {
    const checkAuthentication = () => {
      const id = localStorage.getItem('id');
      setIsAuthenticated(!!id);
    };

    checkAuthentication();
  }, []);

  const login = (id) => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('id');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
