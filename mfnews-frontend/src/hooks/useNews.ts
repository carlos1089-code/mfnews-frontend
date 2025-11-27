import { useState, useEffect } from 'react';
import { NewsService } from '../api/newsService.js';

import type { News } from '../types/index.js'; 

export const useNews = (searchTerm: string = '') => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
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

  const heroNews: News | null = news.length > 0 && news[0] !== undefined ? news[0] : null;
  
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