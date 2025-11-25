import axios from 'axios';

//Aca nos conectamos al back end. Si cambia la URL, solo se modifica aca y listo
const newsApi = axios.create({
    baseURL: 'http://localhost:3000/api'
});


newsApi.interceptors.response.use(
    response => response,
    error => {
        console.error("Error en la API:", error);
        return Promise.reject(error);
    }
);
newsApi.interceptors.request.use(
    config => {
        console.log("Request made with ", config);
        return config;
    },
    error => {
        console.error("Error in request:", error);
        return Promise.reject(error);
    }
);

export default newsApi;