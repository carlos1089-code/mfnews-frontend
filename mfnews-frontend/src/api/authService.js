import newsApi from './axiosConfig';

export const AuthService = {
    login: async (credentials) => {
        const response = await newsApi.post('/auth/login', credentials);
        return response.data;
    },
    
    register: async (userData) => {
        const response = await newsApi.post('/auth/register', userData);
        return response.data;
    }
};