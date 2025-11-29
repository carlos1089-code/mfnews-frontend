import { useState, useEffect } from "react";
import { NewsService } from "../api/newsService.js";
import type { News } from "../types/index.js";

export const useNews = (searchTerm: string = "") => {
  // Inicializamos siempre como array vacío
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Obtenemos la respuesta del servicio (ya tipada como News[])
        const response = await NewsService.getAll(searchTerm);

        setNews(response);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error al cargar noticias");
        setNews([]); // En caso de error, limpiamos para evitar fallos en la UI
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [searchTerm, refreshTrigger]);

  // Lógica derivada (segura porque news siempre es Array ahora)
  const heroNews: News | null = news[0] || null;

  // .slice() es seguro porque 'news' está garantizado como array
  const sideNews: News[] = news.slice(1, 4);
  const gridNews: News[] = news.slice(4);

  return {
    news,
    heroNews,
    sideNews,
    gridNews,
    loading,
    error,
    refetch: () => setRefreshTrigger((prev) => prev + 1),
  };
};
