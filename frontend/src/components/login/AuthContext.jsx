import React, { createContext, useContext, useState, useEffect } from 'react';

// Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para iniciar sesión - Simplificada para usar datos locales
  const login = (userData) => {
    if (!userData || !userData.success) {
      return { success: false, message: 'Error de autenticación' };
    }

    try {
      // Guardar el token en localStorage
      localStorage.setItem('authToken', userData.token);
      
      // Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(userData.user));
      
      // Actualizar estado
      setCurrentUser(userData.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return { success: false, message: error.message || 'Error de autenticación' };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          // En una implementación completa, aquí verificaríamos el token con el backend
          
          // Por ahora solo cargamos el usuario del localStorage
          setCurrentUser(JSON.parse(user));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error verificando autenticación:", error);
          // Si hay error, limpiar todo
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;