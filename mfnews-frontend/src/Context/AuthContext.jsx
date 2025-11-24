// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Asegúrate que este puerto es donde corre tu NestJS
const BASE_URL = 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
  
  // -----------------------------------------------------------
  // 1. ESTADO DEL USUARIO (Con "Lazy Initialization")
  // -----------------------------------------------------------
  // En lugar de iniciar en null, leemos el localStorage INMEDIATAMENTE.
  // Así, cuando haces F5, React ya sabe quién eres antes de pintar nada.
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      
      // Si hay token y datos básicos, reconstruimos el usuario
      if (token && name) {
        return { token, name, role };
      }
      return null;
    } catch (error) {
      return null;
    }
  });

  // Variable derivada: Si user existe es true, si es null es false.
  const isAuthenticated = !!user;

  // -----------------------------------------------------------
  // 2. FUNCIÓN LOGIN (SignIn)
  // -----------------------------------------------------------
  const signIn = async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      
      // Asumiendo que tu backend devuelve: { token: "...", user: { name: "...", role: "..." } }
      // Ajusta esto si tu estructura es diferente (ej. response.data.accessToken)
      const { user, token } = response.data; 

      // Guardamos en Disco (LocalStorage)
      localStorage.setItem('token', token);
      localStorage.setItem('name', user.name);
      localStorage.setItem('role', user.role);

      // Guardamos en Memoria (Estado de React)
      setUser({ ...user, token });

      return { success: true }; 

    } catch (error) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Credenciales inválidas' 
      };
    }
  };

  // -----------------------------------------------------------
  // 3. FUNCIÓN REGISTRO (SignUp)
  // -----------------------------------------------------------
  const signUp = async (name, email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
      
      // Si el backend loguea automáticamente al registrarse:
      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('name', user.name);
        localStorage.setItem('role', user.role);

        setUser({ ...user, token });
      }

      return { success: true }; 

    } catch (error) {
      console.error("Register Error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear la cuenta.' 
      };
    }
  };

  // -----------------------------------------------------------
  // 4. FUNCIÓN LOGOUT
  // -----------------------------------------------------------
  const logout = () => {
    // Borramos todo rastro del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    
    // Reiniciamos estado
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};