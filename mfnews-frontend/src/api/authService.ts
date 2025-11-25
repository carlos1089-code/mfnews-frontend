import newsApi from './axiosConfig.ts';
import type { AuthResponse } from '../types/index.js';

export const AuthService = {
    
    login: async (credentials: any): Promise<AuthResponse> => {
        const response = await newsApi.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },
    
    register: async (userData: any): Promise<AuthResponse> => {
        const response = await newsApi.post<AuthResponse>('/auth/register', userData);
        return response.data;
    }
};