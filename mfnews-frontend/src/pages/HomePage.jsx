import { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress, Box, Alert } from '@mui/material';
import newsApi from '../api/newsApi'; // Importamos nuestra configuración de Axios
import { Navbar } from '../components/Navbar';
import { NewsCard } from '../components/NewsCard';

export const HomePage = () => {
  const [newsList, setNewsList] = useState([]); // Aquí guardamos las noticias
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null);     // Estado de error

  // Esta función se ejecuta UNA vez cuando carga la página
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Hacemos el GET a /api/news
        const response = await newsApi.get('/');
        setNewsList(response.data); // Guardamos los datos en el estado
      } catch (err) {
        console.error("Error cargando noticias:", err);
        setError("No se pudieron cargar las noticias. Revisá que el backend esté prendido.");
      } finally {
        setLoading(false); // Terminó de cargar (sea bien o mal)
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          Últimas Noticias
        </Typography>

        {/* 1. Estado de Carga (Spinner) */}
        {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress color="primary" />
            </Box>
        )}

        {/* 2. Estado de Error */}
        {error && (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        )}

        {/* 3. Lista de Noticias (Grilla) */}
        {!loading && !error && (
            <Grid container spacing={3}>
                {newsList.map((news) => (
                    // xs={12} -> Celular (1 columna)
                    // sm={6}  -> Tablet (2 columnas)
                    // md={4}  -> PC (3 columnas)
                    <Grid item key={news.id} xs={12} sm={6} md={4}>
                        <NewsCard news={news} />
                    </Grid>
                ))}
            </Grid>
        )}

        {/* Mensaje si no hay noticias */}
        {!loading && !error && newsList.length === 0 && (
            <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
                No hay noticias para mostrar.
            </Typography>
        )}
      </Container>
    </>
  );
};