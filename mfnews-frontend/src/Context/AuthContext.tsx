import  React, { createContext, useContext, useState, type ReactNode } from 'react';


import { AuthService } from '../api/authService.ts'; // Usamos el servicio, no axios directo

// 1. Definimos la forma del Usuario en el estado (incluye token)
interface UserState {
  token: string;
  name: string;
  role: string; // Podría ser 'ADMIN' | 'USER' si quieres ser más estricto
}

// 2. Definimos qué devuelve el Login/Register para la UI
interface AuthResult {
  success: boolean;
  error?: string;
}

// 3. Definimos qué datos y funciones expone el Contexto
interface AuthContextType {
  user: UserState | null;
  isAuthenticated: boolean;
  loadingAuth: boolean; // Agregado para compatibilidad con PrivateRoute
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

// Creamos el contexto con valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  
  // Estado de carga (útil si validaras token con backend al iniciar)
  const [loadingAuth] = useState<boolean>(false); 

  // Inicialización Lazy del estado
  const [user, setUser] = useState<UserState | null>(() => {
    try {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      
      if (token && name && role) {
        return { token, name, role };
      }
      return null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;

  // --- LOGIN ---
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      // Usamos el AuthService que ya creamos
      const data = await AuthService.login({ email, password });
      
      // data.user y data.token vienen de la respuesta del servicio
      const { user: apiUser, token } = data; 

      // Guardamos en LocalStorage
      localStorage.setItem('token', token);
      localStorage.setItem('name', apiUser.name);
      localStorage.setItem('role', apiUser.role);

      // Actualizamos estado
      setUser({ 
        name: apiUser.name, 
        role: apiUser.role, 
        token 
      });

      return { success: true }; 

    } catch (error: any) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        // Intentamos leer el mensaje de error del backend
        error: error.response?.data?.message || 'Credenciales inválidas' 
      };
    }
  };

  // --- REGISTRO ---
  const signUp = async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const data = await AuthService.register({ name, email, password });

      if (data.token && data.user) {
        const { token, user: apiUser } = data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('name', apiUser.name);
        localStorage.setItem('role', apiUser.role);

        setUser({ 
            name: apiUser.name, 
            role: apiUser.role, 
            token 
        });
      }

      return { success: true }; 

    } catch (error: any) {
      console.error("Register Error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear la cuenta.' 
      };
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        isAuthenticated, 
        signIn, 
        signUp, 
        logout,
        loadingAuth // Importante pasarlo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
