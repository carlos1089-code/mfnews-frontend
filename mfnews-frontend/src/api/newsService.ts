import newsApi from './axiosConfig.js';
import type { News, CreateNewsDto } from '../types/index.ts';

const ENDPOINT = '/news';

export const NewsService = {

    getAll: async (searchTerm: string = ''): Promise<News[]> => {
        const response = await newsApi.get<News[]>(ENDPOINT, {
            params: { search: searchTerm }
        });
        return response.data;
    },


    getById: async (id: string): Promise<News> => {
        const response = await newsApi.get<News>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    create: async (newsData: CreateNewsDto): Promise<News> => {
        const response = await newsApi.post<News>(ENDPOINT, newsData);
        return response.data;
    },

    update: async (id: string, newsData: Partial<CreateNewsDto>): Promise<News> => {
        const response = await newsApi.patch<News>(`${ENDPOINT}/${id}`, newsData);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await newsApi.delete(`${ENDPOINT}/${id}`);
    }
};