import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert, Divider, Chip, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Navbar } from '../components/Navbar';
import { NewsModal } from '../components/NewsModal';
import { toast } from 'sonner'; // Opcional: Si usas sonner para notificaciones
import { NewsService } from '../api/newsService';

export const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // LEER EL ROL DEL USUARIO
  const role = localStorage.getItem('role'); // "ADMIN" o "USER"

  // Carga la noticia individual

  const loadNews = useCallback(async () => {
    try {
      const data = await NewsService.getById(id);
      console.log("🔍 Noticia cargada:", data);
      setNews(data);
    } catch {
      setError("No se pudo cargar la noticia.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadNews();
  }, [id, loadNews]);

  const handleDelete = async () => {
    if (window.confirm('¿Seguro que quieres eliminar esta noticia?')) {
      try {
        await NewsService.delete(id);
        toast.success("Noticia eliminada"); 
        navigate('/');
      } catch  {
        alert("Error: No tienes permiso o falló el servidor");
      }
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
                    {new Date(news.date || Date.now()).toLocaleDateString()}
                </Typography>
            </Stack>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>{news.title}</Typography>
            
            <Box 
                component="img"
                src={news.image_url || "https://via.placeholder.com/800"}
                alt={news.title}
                sx={{ width: '100%', height: { xs: '250px', md: '450px' }, objectFit: 'cover', borderRadius: 2, mb: 4 }}
            />
            
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {news.body}
            </Typography>
        </article>

        <Divider sx={{ my: 4 }} />
      </Container>

      {/* MODAL CONFIGURADO CORRECTAMENTE 
      */}
      {role === 'ADMIN' && (
          <NewsModal 
            open={openModal}
            handleClose={() => setOpenModal(false)}
            
            initialValues={news} 
       
            onSuccess={() => {
                setOpenModal(false); 
                loadNews();          
            }}
          />
      )}
    </>
  );
};