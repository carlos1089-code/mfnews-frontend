import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AuthService } from "../api/authService.ts";
// Importamos las interfaces compartidas desde tu archivo central de tipos
import type { AuthResult, UserSession } from "../types/index.ts";

// Definimos la forma que tendrá nuestro Contexto (qué datos y funciones expone)
interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  loadingAuth: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  logout: () => void;
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loadingAuth] = useState<boolean>(false);

  // Inicializar estado leyendo del LocalStorage
  // TypeScript inferirá que el estado es UserSession | null
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");
      const role = localStorage.getItem("role");

      if (token && name) {
        // Si hay token, asumimos que está logueado.
        // Convertimos el string del localStorage al tipo 'ADMIN' | 'USER'
        // Si no hay rol guardado, asumimos 'USER' por seguridad.
        return {
          token,
          name,
          role: (role as "ADMIN" | "USER") || "USER",
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;

  // Función auxiliar para guardar datos (DRY)
  // userData viene del backend, tipado como 'any' o podrías importar la interfaz de User del backend
  const saveSession = (token: string, userData: any) => {
    // 1. Guardar en LocalStorage
    localStorage.setItem("token", token);
    localStorage.setItem("name", userData.name);
    // IMPORTANTE: Guardamos el rol que viene del backend.
    localStorage.setItem("role", userData.role || "USER");

    // 2. Actualizar Estado de React
    setUser({
      token,
      name: userData.name,
      role: userData.role || "USER",
    });
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const data = await AuthService.login({ email, password });

      // Verificamos que vengan el token y el usuario
      if (data.token && data.user) {
        saveSession(data.token, data.user);
        return { success: true };
      }
      return { success: false, error: "Respuesta del servidor incompleta" };
    } catch (error: any) {
      console.error("Login Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const data = await AuthService.register({ name, email, password });

      // Verificamos token y usuario en el registro también
      if (data.token && data.user) {
        saveSession(data.token, data.user);
        return { success: true };
      }

      return {
        success: false,
        error: "No se recibió el token de auto-ingreso",
      };
    } catch (error: any) {
      console.error("Register Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al registrarse",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loadingAuth, signIn, signUp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
