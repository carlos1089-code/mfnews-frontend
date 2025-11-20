import axios from 'axios';

//Aca nos conectamos al back end. Si cambia la URL, solo se modifica aca y listo
const newsApi = axios.create({
    baseURL: 'http://localhost:3000/api/news'
});


newsApi.interceptors.response.use(
    response => response,
    error => {
        console.error("Error en la API:", error);
        return Promise.reject(error);
    }
);


/*
El inteceptor es clave y hay varios tipos(este es una de respuesta)
basicamente son funciones que te permiten interceptar y modificar HTTP requests
o respondes ANTES de que sean manejadas por un then y catch

Es como un middleware :)

*/

export default newsApi;