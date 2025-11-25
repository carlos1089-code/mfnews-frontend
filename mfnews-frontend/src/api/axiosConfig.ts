import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Definimos la URL base
const BASE_URL = 'http://localhost:3000/api';

const newsApi: AxiosInstance = axios.create({
    baseURL: BASE_URL
});

// Interceptor de REQUEST
newsApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log("Request made with ", config);
        return config;
    },
    (error: AxiosError) => {
        console.error("Error in request:", error);
        return Promise.reject(error);
    }
);

// Interceptor de RESPONSE
newsApi.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error("Error en la API:", error);
        return Promise.reject(error);
    }
);

export default newsApi;