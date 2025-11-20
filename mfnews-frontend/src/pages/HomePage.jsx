import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, TextField, InputAdornment, IconButton, Card, CardContent, CardMedia, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import newsApi from '../api/newsApi';
import { Navbar } from '../components/Navbar';
import { NewsCard } from '../components/NewsCard';
import { NewsSkeleton } from '../components/NewsSkeleton';

export const HomePage = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el input
  
  // Función para cargar noticias (acepta un término de búsqueda opcional)
  const fetchNews = async (query = '') => {
    setLoading(true);
    try {
      // Si hay query, axios hace: /?search=query
      const response = await newsApi.get('/', { params: { search: query } });
      setNewsList(response.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchNews();
  }, []);

  // Manejar el Enter en el buscador
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchNews(searchTerm);
    }
  };

  // Separamos la noticia destacada (la primera) del resto
  const heroNews = newsList.length > 0 ? newsList[0] : null;
  const otherNews = newsList.length > 1 ? newsList.slice(1) : [];

  return (
    <>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        
        {/* 1. HEADER Y BUSCADOR */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', borderLeft: '6px solid #D32F2F', pl: 2 }}>
            Últimas Noticias
          </Typography>

          <TextField 
            placeholder="Buscar noticia..." 
            variant="outlined" 
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => fetchNews(searchTerm)}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'white', width: { xs: '100%', sm: '300px' } }}
          />
        </Box>

        {/* 2. ESTADO DE CARGA (SKELETON) */}
        {loading && <NewsSkeleton />}

        {/* 3. CONTENIDO REAL */}
        {!loading && newsList.length > 0 && (
          <>
            {/* SECCIÓN HERO (Noticia Principal Gigante) */}
            {heroNews && (
               <Card sx={{ display: 'flex', mb: 6, flexDirection: { xs: 'column', md: 'row' }, height: { md: '400px' }, overflow: 'hidden' }}>
                  {/* Imagen Hero (ocupa 60% en desktop) */}
                  <CardMedia
                    component="img"
                    sx={{ width: { xs: '100%', md: '60%' }, cursor: 'pointer' }}
                    image={heroNews.image_url || "https://via.placeholder.com/800"}
                    alt={heroNews.title}
                    onClick={() => navigate(`/news/${heroNews.id}`)}
                  />
                  
                  {/* Texto Hero */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', md: '40%' }, bgcolor: '#f5f5f5' }}>
                    <CardContent sx={{ flex: '1 0 auto', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Chip label="DESTACADA" color="error" size="small" sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 'bold' }} />
                      <Typography component="div" variant="h4" sx={{ fontWeight: 'bold', mb: 2, cursor: 'pointer', '&:hover': { color: '#D32F2F' } }} onClick={() => navigate(`/news/${heroNews.id}`)}>
                        {heroNews.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        {heroNews.body.substring(0, 150)}...
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 3, color: 'gray' }}>
                        Por {heroNews.author} • {new Date(heroNews.date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Box>
               </Card>
            )}

            {/* GRILLA SECUNDARIA (El resto de noticias) */}
            <Grid container spacing={3}>
              {otherNews.map((news) => (
                <Grid item key={news.id} xs={12} sm={6} md={4}>
                  <NewsCard news={news} />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Estado Vacío */}
        {!loading && newsList.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="h6" color="text.secondary">No se encontraron noticias.</Typography>
            </Box>
        )}

      </Container>
    </>
  );
};