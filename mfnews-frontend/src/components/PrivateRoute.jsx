import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // 👈 Importamos el hook del contexto
import { Box, CircularProgress } from '@mui/material';

export const PrivateRoute = ({ children }) => {
  // Extraemos la info del contexto:
  // - isAuthenticated: ¿Está logueado?
  // - loadingAuth: ¿Todavía estamos verificando el token? (Hidratación)
  const { isAuthenticated, loadingAuth } = useAuth(); 

  // 1. MODO ESPERA:
  // Si recargas la página, el Context tarda unos milisegundos en leer localStorage.
  // Mostramos un spinner para que no te expulse al login por error mientras carga.
  if (loadingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. MODO RECHAZO:
  // Si ya cargó y no hay usuario, te manda al login.
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 3. MODO ACEPTADO:
  // Si hay usuario, muestra la página hija (HomePage o DetailPage).
  return children;
};