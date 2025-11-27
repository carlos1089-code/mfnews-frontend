import newsApi from './axiosConfig.ts';
import type { AuthResponse } from '../types/index.js';

export const AuthService = {
    
    login: async (credentials: any): Promise<AuthResponse> => {
        const response = await newsApi.post<AuthResponse>('/auth/login', credentials);       

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            console.log('✅ Token guardado:', response.data.token);
        }
        
        return response.data;
    },
    
    register: async (userData: any): Promise<AuthResponse> => {
        const response = await newsApi.post<AuthResponse>('/auth/register', userData);
        

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            console.log('✅ Token guardado:', response.data.token);
        }
        
        return response.data;
    },

   
    logout: () => {
        localStorage.removeItem('token');
        console.log('✅ Token eliminado');
    },


    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    }
};