import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BASE_URL = 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      
      if (token && name) {
        return { token, name, role };
      }
      return null;
    } catch {
      return null;
    }
  });


  const isAuthenticated = !!user;

  const signIn = async (email, password) => {
    try {

      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      const { user, token } = response.data; 

      localStorage.setItem('token', token);
      localStorage.setItem('name', user.name);
      localStorage.setItem('role', user.role);

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

  const signUp = async (name, email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
      

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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

