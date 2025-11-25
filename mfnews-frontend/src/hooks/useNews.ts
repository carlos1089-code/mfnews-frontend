import { useState, useEffect } from 'react';
import { NewsService } from '../api/newsService.js';

import type { News } from '../types/index.js'; 

export const useNews = (searchTerm: string = '') => {
  // 1. Tipamos el estado: es un Array de News (News[])
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para refrescar
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // NewsService.getAll ya promete devolver News[], así que data se infiere solo
        const data = await NewsService.getAll(searchTerm);        
        setNews(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error al cargar noticias');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [searchTerm, refreshTrigger]);

  // Lógica de separación
  // TS infiere que heroNews puede ser 'News' o 'null'
  const heroNews: News | null = news.length > 0 && news[0] !== undefined ? news[0] : null;
  
  // TS infiere que estos son News[]
  const sideNews: News[] = news.slice(1, 4); 
  const gridNews: News[] = news.slice(4);

  return { 
    news, 
    heroNews, 
    sideNews, 
    gridNews, 
    loading, 
    error,
    refetch: () => setRefreshTrigger(prev => prev + 1)
  };
};