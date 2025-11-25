import newsApi from './axiosConfig'; 

const ENDPOINT = '/news'; 

export const NewsService = {
    getAll: async (searchTerm = '') => {
        const response = await newsApi.get(ENDPOINT, {
            params: { search: searchTerm }
        });
        return response.data; 
    },

    getById: async (id) => {
        const response = await newsApi.get(`${ENDPOINT}/${id}`);
        return response.data;
    },

    create: async (newsData) => {
        const response = await newsApi.post(ENDPOINT, newsData);
        return response.data;
    },

    update: async (id, newsData) => {
        const response = await newsApi.patch(`${ENDPOINT}/${id}`, newsData);
        return response.data;
    },

    delete: async (id) => {
        const response = await newsApi.delete(`${ENDPOINT}/${id}`);
        return response.data;
    }
};