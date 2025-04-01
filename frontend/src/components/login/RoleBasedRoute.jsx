// RoleBasedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente para proteger rutas basadas en roles específicos
 * Si el usuario no tiene el rol requerido, redirecciona a su página principal
 */
const RoleBasedRoute = ({ allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Si no está autenticado, esto no debería ocurrir porque ProtectedRoute
  // ya debería haberlo redirigido, pero por seguridad comprobamos de nuevo
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // Verificar si el usuario tiene el rol adecuado
  if (!allowedRoles.includes(currentUser.role)) {
    // Redirigir a la ruta principal basada en su rol
    return <Navigate to={`/${currentUser.role.toLowerCase()}/homePage`} replace />;
  }
  
  // Si tiene permiso, permitir acceso a la ruta
  return <Outlet />;
};

export default RoleBasedRoute;