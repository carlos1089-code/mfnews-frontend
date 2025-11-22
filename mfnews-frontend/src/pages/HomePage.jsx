// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import { 
    Container, Typography, Box, Card, CardContent, CardMedia, 
    Chip, Divider, Stack, Paper, Alert 
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Importación estable (V5)
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Componentes
import { NewsSkeleton } from '../components/NewsSkeleton';
import { MainLayout } from '../layout/MainLayout';
import { NewsCard } from '../components/NewsCard';

// 🚀 IMPORTAMOS NUESTRO HOOK
import { useNews } from '../hooks/useNews';

export const HomePage = () => {
  const navigate = useNavigate();

  const { heroNews, sideNews, gridNews, loading, error } = useNews();

  return (
    <MainLayout>
        <Box sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
            <Typography variant="overline" color="text.secondary">
                {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
        </Box>

    
        {error && (
             <Alert severity="error" sx={{ mb: 2 }}>
                 Hubo un problema cargando las noticias. Verifica tu conexión.
             </Alert>
        )}

        {loading ? <NewsSkeleton /> : (
            <Grid container spacing={4}> 
                
                {/* === HERO === */}
                <Grid item xs={12} md={8}> 
                    {heroNews && (
                        <Box 
                           sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', boxShadow: 3, height: '450px' }}
                           onClick={() => navigate(`/news/${heroNews.id}`)}
                        >
                           <Box 
                              component="img"
                              src={heroNews.image_url}
                              alt={heroNews.title}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' }}}
                           />
                           <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: 'white', p: 4, pt: 10 }}>
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

                {/* === TENDENCIAS === */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                        <Typography variant="h6" sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 1, mb: 2, fontWeight: 'bold' }}>
                            TENDENCIAS
                        </Typography>
                        <Stack spacing={2}>
                            {sideNews.map((news) => (
                                <Box key={news.id} onClick={() => navigate(`/news/${news.id}`)} sx={{ cursor: 'pointer', display: 'flex', gap: 2 }}>
                                    <Box component="img" src={news.image_url} sx={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 2 }} />
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

                {/* === GRILLA === */}
                <Grid item xs={12}>
                     <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', mt: 2 }}>Más Noticias</Typography>
                     <Grid container spacing={3}>
                        {gridNews.map((news) => (
                            <Grid item key={news.id} xs={12} sm={6} md={3}>
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