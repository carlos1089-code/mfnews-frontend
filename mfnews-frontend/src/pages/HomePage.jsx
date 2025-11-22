import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, CardMedia, Chip, Divider, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import newsApi from '../api/newsApi';
import { Navbar } from '../components/Navbar';
import { NewsSkeleton } from '../components/NewsSkeleton';

export const HomePage = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await newsApi.get('/');
      setNewsList(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ESTRATEGIA EDITORIAL:
  // 1. La primera es la "Tapa" (Hero)
  const heroNews = newsList[0];
  // 2. Las siguientes 3 son "Destacados laterales"
  const sideNews = newsList.slice(1, 4);
  // 3. El resto es la "Grilla general"
  const gridNews = newsList.slice(4);

  return (
    <Box sx={{ bgcolor: '#f4f4f4', minHeight: '100vh' }}> {/* Fondo gris claro profesional */}
      <Navbar />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        
        {/* ENCABEZADO DE FECHA (Toque sutil) */}
        <Box sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 1 }}>
            <Typography variant="overline" color="text.secondary">
                {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
        </Box>

        {loading ? <NewsSkeleton /> : (
          <Grid container spacing={4}>
            
            {/* === COLUMNA IZQUIERDA: HERO (70%) === */}
            <Grid item xs={12} md={8}>
              {heroNews && (
                <Card 
                    elevation={0} // Diseño plano (Flat Design)
                    sx={{ cursor: 'pointer', position: 'relative', borderRadius: 2, overflow: 'hidden' }}
                    onClick={() => navigate(`/news/${heroNews.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="450"
                    image={heroNews.image_url}
                    alt={heroNews.title}
                    sx={{ filter: 'brightness(0.9)', transition: '0.3s', '&:hover': { filter: 'brightness(1)' } }}
                  />
                  {/* Gradiente para que se lea el texto */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                      color: 'white',
                      p: 4,
                      pt: 10
                    }}
                  >
                    <Chip label="AHORA" color="error" size="small" sx={{ mb: 1, fontWeight: 'bold' }} />
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', lineHeight: 1.1, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                      {heroNews.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, opacity: 0.9 }}>
                        <Typography variant="subtitle2">{heroNews.author}</Typography>
                        <Typography variant="caption">•</Typography>
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">Hace instantes</Typography>
                    </Stack>
                  </Box>
                </Card>
              )}
            </Grid>

            {/* === COLUMNA DERECHA: LO MÁS LEÍDO (30%) === */}
            <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
                    <Typography variant="h6" sx={{ borderLeft: '4px solid #D32F2F', pl: 1, mb: 2, fontWeight: 'bold' }}>
                        TENDENCIAS
                    </Typography>
                    
                    <Stack spacing={2}>
                        {sideNews.map((news) => (
                            <Box key={news.id} onClick={() => navigate(`/news/${news.id}`)} sx={{ cursor: 'pointer', '&:hover .title': { color: '#D32F2F' } }}>
                                <Stack direction="row" spacing={2}>
                                    {/* Imagen pequeña cuadrada */}
                                    <Box 
                                        component="img" 
                                        src={news.image_url} 
                                        sx={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 1 }}
                                    />
                                    <Box>
                                        <Chip label={news.author} size="small" sx={{ height: 20, fontSize: '0.6rem', mb: 0.5 }} />
                                        <Typography className="title" variant="body1" sx={{ fontWeight: 'bold', lineHeight: 1.2, transition: '0.2s' }}>
                                            {news.title}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ mt: 2 }} />
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            </Grid>

            {/* === ABAJO: GRILLA RESTANTE === */}
            <Grid item xs={12}>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Más Noticias</Typography>
                    <Grid container spacing={3}>
                        {gridNews.map((news) => (
                            <Grid item xs={12} sm={6} md={3} key={news.id}>
                                <Card 
                                    elevation={0} 
                                    sx={{ height: '100%', bgcolor: 'transparent', cursor: 'pointer' }}
                                    onClick={() => navigate(`/news/${news.id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={news.image_url}
                                        sx={{ borderRadius: 2, mb: 1 }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        {new Date(news.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.3, '&:hover': { color: '#D32F2F' } }}>
                                        {news.title}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Grid>

          </Grid>
        )}
      </Container>
    </Box>
  );
};