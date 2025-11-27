import newsApi from './axiosConfig.ts';
import type { AuthResponse } from '../types/index.js';

export const AuthService = {
    
    login: async (credentials: any): Promise<AuthResponse> => {
        const response = await newsApi.post<AuthResponse>('/auth/login', credentials);
        
        // 🔑 GUARDAR EL TOKEN
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            console.log('✅ Token guardado:', response.data.token);
        }
        
        return response.data;
    },
    
    register: async (userData: any): Promise<AuthResponse> => {
        const response = await newsApi.post<AuthResponse>('/auth/register', userData);
        
        // 🔑 GUARDAR EL TOKEN
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            console.log('✅ Token guardado:', response.data.token);
        }
        
        return response.data;
    },

    // 🚪 Función para cerrar sesión
    logout: () => {
        localStorage.removeItem('token');
        console.log('✅ Token eliminado');
    },

    // 🔍 Verificar si hay sesión activa
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    }
};