import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert, Divider, Chip, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import newsApi from '../api/newsApi';
import { Navbar } from '../components/Navbar';

export const DetailPage = () => {
  const { id } = useParams(); // 1. Capturamos el ID de la URL
  const navigate = useNavigate();
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar la noticia al entrar
  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await newsApi.get(`/${id}`);
        setNews(response.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la noticia. Puede que no exista o el servidor falló.");
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [id]);

  // Manejar eliminación (Bonus: Funcionalidad real)
  const handleDelete = async () => {
    // Usamos un confirm nativo por ahora (luego podemos hacerlo modal)
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia? Esta acción no se puede deshacer.')) {
      try {
        await newsApi.delete(`/${id}`);
        navigate('/'); // Volvemos al home tras borrar
      } catch (err) {
        alert("Error al eliminar la noticia");
      }
    }
  };

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );
  }

  if (error || !news) {
    return (
        <Container sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
                Volver al inicio
            </Button>
        </Container>
    );
  }

  return (
    <>
      <Navbar />
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        
        {/* 1. BOTONERA SUPERIOR (Navegación y Acciones) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
                Volver
            </Button>

            <Stack direction="row" spacing={2}>
                <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => alert("Próximamente: Editar")} // Lo haremos en el siguiente paso
                >
                    Editar
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                >
                    Eliminar
                </Button>
            </Stack>
        </Box>

        {/* 2. CONTENIDO DE LA NOTICIA */}
        <article>
            {/* Categoría / Autor / Fecha */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Chip label={news.author} color="primary" size="small" />
                <Typography variant="caption" color="text.secondary">
                    {new Date(news.date).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
            </Stack>

            {/* Título */}
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2, lineHeight: 1.2 }}>
                {news.title}
            </Typography>

            {/* Imagen Principal */}
            <Box 
                component="img"
                src={news.image_url}
                alt={news.title}
                sx={{ 
                    width: '100%', 
                    height: { xs: '250px', md: '450px' }, // Responsive
                    objectFit: 'cover', 
                    borderRadius: 2,
                    mb: 4,
                    boxShadow: 3
                }}
            />

            {/* Cuerpo del texto */}
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333' }}>
                {news.body}
            </Typography>
        </article>

        <Divider sx={{ my: 4 }} />
        
      </Container>
    </>
  );
};