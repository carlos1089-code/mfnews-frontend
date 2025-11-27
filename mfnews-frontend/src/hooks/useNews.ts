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
        // 1. Obtenemos la respuesta "cruda" del servicio
        const response: any = await NewsService.getAll(searchTerm);

        console.log("🔍 Datos recibidos de la API:", response); // MIRA ESTO EN CONSOLA (F12)

        // 2. Verificamos y extraemos el array correctamente
        let dataArray: News[] = [];

        if (Array.isArray(response)) {
          // Caso A: La API devuelve directamente el array [ {...}, {...} ]
          dataArray = response;
        } else if (response && Array.isArray(response.data)) {
          // Caso B: La API devuelve { data: [...] } (común en Axios o backends estandar)
          dataArray = response.data;
        } else if (response && Array.isArray(response.articles)) {
          // Caso C: La API devuelve { articles: [...] } (común en NewsAPI)
          dataArray = response.articles;
        } else {
          console.warn(
            "⚠️ Formato de datos desconocido, se usará array vacío."
          );
          dataArray = [];
        }

        setNews(dataArray);
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
