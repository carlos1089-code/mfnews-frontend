import { useState, useEffect } from 'react';
// IMPORTAMOS EL SERVICIO
import { NewsService } from '../api/newsService';

export const useNews = (searchTerm = '') => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado extra para forzar recarga (refetch real)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  }, [searchTerm, refreshTrigger]); // Se ejecuta si cambia la búsqueda o el trigger

  // Lógica de separación (Hero / Grid) - Se mantiene igual
  const heroNews = news.length > 0 ? news[0] : null;
  // Slice seguro: si hay menos de 1, devuelve array vacío
  const sideNews = news.slice(1, 4); 
  const gridNews = news.slice(4);

  return { 
    news, 
    heroNews, 
    sideNews, 
    gridNews, 
    loading, 
    error,
    // Refetch real: cambiamos un contador para disparar el useEffect de nuevo
    refetch: () => setRefreshTrigger(prev => prev + 1)
  };
};