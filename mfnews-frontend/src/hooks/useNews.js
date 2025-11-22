// src/hooks/useNews.js
import { useState, useEffect } from 'react';
import newsApi from '../api/newsApi';

export const useNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsApi.get('/');
      setNewsList(response.data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al montar el hook
  useEffect(() => {
    fetchNews();
  }, []);


  const heroNews = newsList[0];
  const sideNews = newsList.slice(1, 4);
  const gridNews = newsList.slice(4);

  // Retornamos todo lo que la vista necesita
  return {

    newsList,
    heroNews,
    sideNews,
    gridNews,
    // Estados
    loading,
    error,
    // Funciones (por si quieres agregar un botón de "Recargar")
    refetch: fetchNews 
  };
};