import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.tsx';
import { Box, CircularProgress } from '@mui/material';
import { type ReactNode } from 'react'; // IMPORTANTE: Importamos el tipo

// Definimos la interfaz para las props
interface PrivateRouteProps {
    children: ReactNode; // 'children' puede ser un componente, texto, null, etc.
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // Extraemos la info del contexto
  // TS inferirá los tipos de isAuthenticated y loadingAuth desde el hook useAuth
  const { isAuthenticated, loadingAuth } = useAuth(); 

  // 1. MODO ESPERA:
  if (loadingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. MODO RECHAZO:
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 3. MODO ACEPTADO:
  // En TS, debemos envolver children en un fragmento <>...</> si no estamos seguros,
  // pero ReactNode es un retorno válido, así que esto funciona directo:
  return <>{children}</>;
};