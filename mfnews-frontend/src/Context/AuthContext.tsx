import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AuthService } from "../api/authService.ts";

import type { AuthResult, UserSession, User } from "../types/index.ts";


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


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loadingAuth] = useState<boolean>(false);

  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");
      const role = localStorage.getItem("role");

      if (token && name) {

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

  const saveSession = (token: string, userData: User) => {

    localStorage.setItem("token", token);
    localStorage.setItem("name", userData.name);

    localStorage.setItem("role", userData.role || "USER");


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


      if (data.token && data.user) {
        saveSession(data.token, data.user);
        return { success: true };
      }
      return { success: false, error: "Respuesta del servidor incompleta" };
    } catch (error: unknown) {
      console.error("Login Error:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : (error as any)?.response?.data?.message || "Error al iniciar sesión";
      return {
        success: false,
        error: errorMessage,
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


      if (data.token && data.user) {
        saveSession(data.token, data.user);
        return { success: true };
      }

      return {
        success: false,
        error: "No se recibió el token de auto-ingreso",
      };
    } catch (error: unknown) {
      console.error("Register Error:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : (error as any)?.response?.data?.message || "Error al registrarse";
      return {
        success: false,
        error: errorMessage,
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


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
