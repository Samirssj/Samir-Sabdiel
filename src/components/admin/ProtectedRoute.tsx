import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, authService } from '@/services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      // Verificar si hay token en localStorage
      if (!isAuthenticated()) {
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      // Verificar token con el servidor
      const response = await authService.verify();
      setIsValid(!!response.isAdmin);
    } catch (error) {
      console.error('Auth verification failed:', error);
      setIsValid(false);
      // Limpiar tokens inválidos
      authService.logout();
    } finally {
      setIsVerifying(false);
    }
  };

  // Mostrar loading mientras verifica
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirigir al inicio si no es admin
  if (!isValid) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Renderizar componente protegido
  return <>{children}</>;
};

export default ProtectedRoute;
