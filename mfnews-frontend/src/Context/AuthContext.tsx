import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { AuthService } from '../api/authService.ts';
interface UserState {
  token: string;
  name: string;
  role: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: UserState | null;
  isAuthenticated: boolean;
  loadingAuth: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loadingAuth] = useState<boolean>(false);

  // Inicializar estado leyendo del LocalStorage
  const [user, setUser] = useState<UserState | null>(() => {
    try {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      if (token && name) {
        // Si hay token, asumimos que está logueado. Si no hay rol, ponemos USER por defecto
        return { token, name, role: role || 'USER' };
      }
      return null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;

  // Función auxiliar para guardar datos (DRY - Don't Repeat Yourself)
  const saveSession = (token: string, userData: any) => {
    // 1. Guardar en LocalStorage
    localStorage.setItem('token', token);
    localStorage.setItem('name', userData.name);
    // IMPORTANTE: Guardamos el rol que viene del backend. Si no viene, default a USER.
    localStorage.setItem('role', userData.role || 'USER');

    // 2. Actualizar Estado de React
    setUser({
      token,
      name: userData.name,
      role: userData.role || 'USER',
    });
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const data = await AuthService.login({ email, password });
      
      // AQUI ESTA LA CLAVE: El backend ahora devuelve 'token' y 'user.role'
      if (data.token && data.user) {
        saveSession(data.token, data.user);
        return { success: true };
      }
      return { success: false, error: "Respuesta del servidor incompleta" };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' };
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const data = await AuthService.register({ name, email, password });

      // AQUI ESTA LA CLAVE: Ahora el registro TAMBIÉN devuelve token y rol
      if (data.token && data.user) {
        saveSession(data.token, data.user);
        return { success: true };
      }
      
      return { success: false, error: "No se recibió el token de auto-ingreso" };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Error al registrarse' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loadingAuth, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};