import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const newsApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

newsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("✅ Request made with config:", {
      url: config.url,
      baseURL: config.baseURL, // Agregué esto para que veas a dónde apunta realment
      method: config.method,
      hasToken: !!token,
    });

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Error in request:", error);
    return Promise.reject(error);
  }
);

newsApi.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status);
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("🚫 Error 401: Token inválido o expirado");
      // Aquí podrías redirigir al login si quisieras
    }
    console.error("❌ Error en la API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default newsApi;
