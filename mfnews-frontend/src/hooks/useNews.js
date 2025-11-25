import { useState, useEffect } from 'react';
import newsApi from '../api/newsApi';

// 1. Recibimos el searchTerm (por defecto vacío)
export const useNews = (searchTerm = '') => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data } = await newsApi.get('/news', {
            params: { search: searchTerm }
        });
        
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
  }, [searchTerm]); // 3. Se ejecuta cada vez que cambia la búsqueda

  // Lógica de separación (Hero / Grid)
  const heroNews = news.length > 0 ? news[0] : null;
  const sideNews = news.length > 0 ? news.slice(1, 4) : [];
  const gridNews = news.length > 0 ? news.slice(4) : [];

  return { 
    news, 
    heroNews, 
    sideNews, 
    gridNews, 
    loading, 
    error,
    // Exportamos una función manual por si queremos recargar sin cambiar búsqueda
    refetch: () => setNews([...news]) 
  };
};