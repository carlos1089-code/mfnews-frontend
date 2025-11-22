// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

// 1. Creamos el Contexto (La "tubería" vacía)
const AuthContext = createContext();

// 2. Creamos el Provider (El componente que tiene la lógica)
export const AuthProvider = ({ children }) => {
  
  // Estado global del usuario. Si es null, no hay nadie logueado.
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // Para no mostrar la app hasta verificar token

  // Efecto para verificar si ya había sesión al recargar la página (Hidratación)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedName) {
      setUser({
        name: storedName,
        role: storedRole,
        token: storedToken
      });
      setIsAuthenticated(true);
    }
    setLoadingAuth(false);
  }, []);

  // FUNCIÓN LOGIN: Se llama cuando el usuario pone user/pass correctos
  const login = (userData, token) => {
    // 1. Guardamos en LocalStorage (Persistencia)
    localStorage.setItem('token', token);
    localStorage.setItem('name', userData.name);
    localStorage.setItem('role', userData.role);

    // 2. Actualizamos el ESTADO (React reacciona al instante)
    setUser({ ...userData, token });
    setIsAuthenticated(true);
  };

  // FUNCIÓN LOGOUT: Limpia todo
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');

    setUser(null);
    setIsAuthenticated(false);
  };

  // Exportamos los datos y funciones para que cualquiera los use
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {!loadingAuth && children} 
    </AuthContext.Provider>
  );
};

// 3. Custom Hook para no tener que importar useContext en cada archivo
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};