// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BASE_URL = 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // ... (Misma lógica de hidratación que antes) ...
    const token = localStorage.getItem('token');
    // ...
    setLoadingAuth(false);
  }, []);

  // --- NUEVA FUNCIÓN LOGIN "PRO" ---
  // Esta función recibe email/pass, llama a la API y actualiza el estado.
  // Retorna un objeto { success: true/false, error: string } para que la UI sepa qué decir.
  const signIn = async (email, password) => {
    try {
       const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      
      const { user, token } = response.data;

      // 1. Guardar en Storage
      localStorage.setItem('token', token);
      localStorage.setItem('name', user.name);
      localStorage.setItem('role', user.role);

      // 2. Guardar en Estado
      setUser({ ...user, token });
      setIsAuthenticated(true);

      return { success: true }; // ✅ Todo salió bien

    } catch (error) {
      console.error(error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Credenciales inválidas' 
      }; // ❌ Algo falló
    }
  };

  const signUp = async (name, email, password) => {
    try {
      // 1. Llamada a la API
      const response = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
      
      // 2. AUTO-LOGIN:
      // Si tu backend devuelve el token al registrarse (lo ideal), logueamos al usuario de una.
      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('name', user.name);
        localStorage.setItem('role', user.role);

        setUser({ ...user, token });
        setIsAuthenticated(true);
      }

      return { success: true }; 

    } catch (error) {
      console.error(error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al crear la cuenta.' 
      };
    }
  };

  const logout = () => {
    // ... (Misma lógica de logout) ...
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, logout }}>
      {!loadingAuth && children} 
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};