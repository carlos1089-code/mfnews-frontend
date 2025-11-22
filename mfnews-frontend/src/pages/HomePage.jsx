import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, CardMedia, Chip, Divider, Stack, Paper } from '@mui/material'; 
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import newsApi from '../api/newsApi';
import { NewsSkeleton } from '../components/NewsSkeleton';
import { MainLayout } from '../layout/MainLayout';
import { NewsCard } from '../components/NewsCard'; // Ajusta la ruta si es necesario

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
    <MainLayout>
        <Box sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
            <Typography variant="overline" color="text.secondary">
                {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
        </Box>

        {loading ? <NewsSkeleton /> : (
            // En MUI v6, Grid es "container" por defecto. Usamos "spacing" igual que antes.
            <Grid container spacing={4}> 
                
                {/* === COLUMNA IZQUIERDA: HERO === */}
                {/* En MUI v6 usamos la prop 'size' en lugar de xs/md directos */}
                <Grid size={{ xs: 12, md: 8 }}> 
                    {heroNews && (
                       <Box 
                          sx={{ 
                            position: 'relative', 
                            borderRadius: 4, 
                            overflow: 'hidden', 
                            cursor: 'pointer',
                            boxShadow: 3,
                            height: '450px'
                          }}
                          onClick={() => navigate(`/news/${heroNews.id}`)}
                       >
                           <Box 
                              component="img"
                              src={heroNews.image_url}
                              alt={heroNews.title}
                              sx={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.02)' }
                              }}
                           />
                           <Box sx={{
                              position: 'absolute', bottom: 0, left: 0, width: '100%',
                              background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                              color: 'white', p: 4, pt: 10
                           }}>
                              <Chip label="AHORA" color="error" size="small" sx={{ mb: 1, fontWeight: 'bold' }} />
                              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                {heroNews.title}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, opacity: 0.9 }}>
                                  <Typography variant="subtitle2">{heroNews.author}</Typography>
                                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                              </Stack>
                           </Box>
                       </Box>
                    )}
                </Grid>

                {/* === COLUMNA DERECHA: TENDENCIAS === */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                        <Typography variant="h6" sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 1, mb: 2, fontWeight: 'bold' }}>
                            TENDENCIAS
                        </Typography>
                        
                        <Stack spacing={2}>
                            {sideNews.map((news) => (
                                <Box key={news.id} onClick={() => navigate(`/news/${news.id}`)} sx={{ cursor: 'pointer', display: 'flex', gap: 2 }}>
                                    <Box 
                                        component="img" 
                                        src={news.image_url} 
                                        sx={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 2 }}
                                    />
                                    <Box>
                                        <Chip label={news.author} size="small" sx={{ height: 20, fontSize: '0.6rem', mb: 0.5 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                                            {news.title}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                {/* === GRILLA INFERIOR === */}
                <Grid size={{ xs: 12 }}>
                     <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', mt: 2 }}>Más Noticias</Typography>
                     <Grid container spacing={3}>
                        {gridNews.map((news) => (
                            // AQUI ESTABA TU ERROR: Cambiamos xs={12} por size={{ xs: 12 ... }}
                            <Grid key={news.id} size={{ xs: 12, sm: 6, md: 3 }}>
                                <NewsCard news={news} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        )}
    </MainLayout>
  );
};

