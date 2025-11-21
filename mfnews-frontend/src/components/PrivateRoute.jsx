import { Navigate } from 'react-router-dom';

// Este componente recibe a su "hijo" (la página que querés proteger)
export const PrivateRoute = ({ children }) => {
  
  // 1. Buscamos el token
  const token = localStorage.getItem('token');

  // 2. Si hay token, mostramos la página (children)
  // 3. Si NO hay token, redirigimos a /login
  return token ? children : <Navigate to="/login" />;
};