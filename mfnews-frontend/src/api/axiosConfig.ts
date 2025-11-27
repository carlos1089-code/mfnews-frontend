import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Definimos la URL base
const BASE_URL = 'http://localhost:3000/api';

const newsApi: AxiosInstance = axios.create({
    baseURL: BASE_URL
});

// Interceptor de REQUEST - AGREGAMOS EL TOKEN AQUÍ 👇
newsApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 🔑 Obtener el token del localStorage
        const token = localStorage.getItem('token');
        
        // Si existe el token, agregarlo a los headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log("✅ Request made with config:", {
            url: config.url,
            method: config.method,
            hasToken: !!token
        });
        
        return config;
    },
    (error: AxiosError) => {
        console.error("❌ Error in request:", error);
        return Promise.reject(error);
    }
);

// Interceptor de RESPONSE
newsApi.interceptors.response.use(
    (response) => {
        console.log("✅ Response received:", response.status);
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.error("🚫 Error 401: Token inválido o expirado");
            // Opcional: redirigir al login
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        console.error("❌ Error en la API:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default newsApi;