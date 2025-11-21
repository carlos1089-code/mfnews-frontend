import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert, Divider, Chip, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import newsApi from '../api/newsApi';
import { Navbar } from '../components/Navbar';
import { NewsModal } from '../components/NewsModal';

export const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // LEER EL ROL DEL USUARIO
  const role = localStorage.getItem('role'); // "ADMIN" o "USER"

  const loadNews = async () => {
    try {
      const response = await newsApi.get(`/${id}`);
      setNews(response.data);
    } catch (err) {
      setError("No se pudo cargar la noticia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('¿Seguro que quieres eliminar?')) {
      try {
        await newsApi.delete(`/${id}`);
        navigate('/');
      } catch (err) {
        alert("Error: No tienes permiso o falló el servidor");
      }
    }
  };

  const handleEdit = async (values) => {
    try {
      await newsApi.put(`/${id}`, values);
      await loadNews();
      alert("Noticia actualizada correctamente");
      setOpenModal(false);
    } catch (error) {
      alert("Error al actualizar la noticia");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error || !news) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <>
      <Navbar />
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>Volver</Button>

            {/* 🔒 PROTECCIÓN VISUAL: Solo renderizamos si es ADMIN */}
            {role === 'ADMIN' && (
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="outlined" 
                        startIcon={<EditIcon />}
                        onClick={() => setOpenModal(true)} 
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
            )}
        </Box>

        <article>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Chip label={news.author} color="primary" size="small" />
                <Typography variant="caption" color="text.secondary">
                    {new Date(news.date).toLocaleDateString()}
                </Typography>
            </Stack>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>{news.title}</Typography>
            
            <Box 
                component="img"
                src={news.image_url || "https://via.placeholder.com/800"}
                alt={news.title}
                sx={{ width: '100%', height: { xs: '250px', md: '450px' }, objectFit: 'cover', borderRadius: 2, mb: 4 }}
            />
            
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>{news.body}</Typography>
        </article>

        <Divider sx={{ my: 4 }} />
      </Container>

      {/* El modal también lo protegemos o simplemente no se abrirá porque no hay botón */}
      {role === 'ADMIN' && (
          <NewsModal 
            open={openModal}
            handleClose={() => setOpenModal(false)}
            onSubmit={handleEdit}
            initialValues={{
                title: news.title,
                author: news.author,
                image_url: news.image_url,
                body: news.body
            }}
          />
      )}
    </>
  );
};