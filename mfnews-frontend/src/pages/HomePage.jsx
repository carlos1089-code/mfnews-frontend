import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Typography, Box, Chip, Stack, Paper, Alert,
    TextField, InputAdornment // 👈 Importante: Estos componentes son la barra
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search'; // 👈 Importante: El icono

// Componentes y Hooks
import { NewsSkeleton } from '../components/NewsSkeleton';
import { MainLayout } from '../layout/MainLayout';
import { NewsCard } from '../components/NewsCard';
import { useNews } from '../hooks/useNews';
import { useDebounce } from '../hooks/useDebounce'; 

export const HomePage = () => {
  const navigate = useNavigate();

  // 1. Estado local para el input
  const [searchTerm, setSearchTerm] = useState('');
  
  // 2. Debounce para no saturar la API
  const debouncedSearch = useDebounce(searchTerm, 500);

  // 3. Pasamos el valor al hook
  const { heroNews, sideNews, gridNews, loading, error } = useNews(debouncedSearch);

  return (
    <MainLayout>
        {/* === ZONA SUPERIOR: FECHA Y BUSCADOR === */}
        <Box sx={{ 
            mb: 4, 
            borderBottom: '1px solid', 
            borderColor: 'divider', 
            pb: 2,
            display: 'flex', 
            justifyContent: 'space-between', // Separa fecha a la izq y buscador a la der
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
        }}>
            {/* FECHA */}
            <Typography variant="overline" color="text.secondary">
                {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>

            {/* 👇👇 AQUÍ ESTÁ LA BARRA DE BÚSQUEDA 👇👇 */}
            <TextField 
                size="small"
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: { xs: '100%', sm: '300px' } }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>

        {error && (
             <Alert severity="error" sx={{ mb: 2 }}>
                 Hubo un problema cargando las noticias.
             </Alert>
        )}

        {/* MENSAJE SI NO HAY RESULTADOS */}
        {!loading && !heroNews && searchTerm && (
            <Box textAlign="center" py={5}>
                <Typography variant="h6" color="text.secondary">
                    No encontramos noticias sobre "{searchTerm}" 
                </Typography>
            </Box>
        )}

        {loading ? <NewsSkeleton /> : (
            // Solo mostramos la grilla si hay al menos una noticia (heroNews)
            heroNews && (
                <Grid container spacing={4}> 
                    
                    {/* === HERO (Noticia Principal) === */}
                    <Grid item xs={12} md={8}> 
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
                              <Chip label="DESTACADO" color="error" size="small" sx={{ mb: 1, fontWeight: 'bold' }} />
                              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                {heroNews.title}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, opacity: 0.9 }}>
                                  <Typography variant="subtitle2">{heroNews.author}</Typography>
                                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                              </Stack>
                           </Box>
                        </Box>
                    </Grid>

                    {/* === TENDENCIAS (Lista lateral) === */}
                    <Grid item xs={12} md={4}>
                         <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                            <Typography variant="h6" sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 1, mb: 2, fontWeight: 'bold' }}>
                                {searchTerm ? 'RESULTADOS' : 'TENDENCIAS'}
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

                    {/* === GRILLA INFERIOR === */}
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
            )
        )}
    </MainLayout>
  );
};