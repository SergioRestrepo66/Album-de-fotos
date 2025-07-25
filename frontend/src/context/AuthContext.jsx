import React, { createContext, useContext, useState } from 'react';

// Contexto de autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Recupera usuario de localStorage si existe con manejo de errores
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al cargar datos de usuario:', error);
      // Limpiar datos corruptos
      localStorage.removeItem('userData');
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error al guardar datos de usuario:', error);
      if (error.name === 'QuotaExceededError') {
        // Si no hay espacio, limpiar localStorage y reintentar
        localStorage.clear();
        try {
          localStorage.setItem('userData', JSON.stringify(userData));
        } catch (secondError) {
          console.error('Error persistente al guardar usuario:', secondError);
        }
      }
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('userData');
    } catch (error) {
      console.error('Error al eliminar datos de usuario:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);