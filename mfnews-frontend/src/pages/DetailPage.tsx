import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert, Divider, Chip, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Navbar } from '../components/Navbar.tsx';
import { NewsModal } from '../components/NewsModal.tsx';
import { toast } from 'sonner';
import { NewsService } from '../api/newsService.ts';
// Importamos el tipo News
// Importamos el tipo News
import type { News } from '../types/index.ts'; 

// Definimos el tipo de los parámetros de la URL
interface DetailParams extends Record<string, string | undefined> {
    id: string; // El ID de la URL siempre es un string
}

export const DetailPage = () => {
  // 1. Tipamos useParams: devuelve un objeto con la propiedad 'id' como string
  const { id } = useParams<DetailParams>(); 
  const navigate = useNavigate();
  
  // 2. Tipamos los estados
  const [news, setNews] = useState<News | null>(null); // Puede ser News o null
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // LEER EL ROL DEL USUARIO
  const role: string | null = localStorage.getItem('role'); // Puede ser string o null

  // Carga la noticia individual
  const loadNews = useCallback(async () => {
    // Es vital que el ID exista antes de llamar al servicio
    if (!id) {
        setLoading(false);
        setError("ID de noticia no encontrado.");
        return;
    }
    
    try {
      // NewsService.getById ya promete devolver News
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
    if (!id) return; // Validación de ID antes de eliminar
    
    if (window.confirm('¿Seguro que quieres eliminar esta noticia?')) {
      try {
        await NewsService.delete(id);
        toast.success("Noticia eliminada"); 
        navigate('/');
      } catch (err) {
        alert("Error: No tienes permiso o falló el servidor");
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  // 3. Verificamos que news exista para seguir renderizando
  if (error || !news) return <Alert severity="error" sx={{ mt: 4 }}>{error || "Noticia no disponible"}</Alert>;

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
                {/* 4. TS sabe que news existe aquí */}
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

      {role === 'ADMIN' && news && ( // También aseguramos que news exista antes de pasar initialValues
          <NewsModal 
            open={openModal}
            handleClose={() => setOpenModal(false)}
            initialValues={news} // Ahora initialValues es de tipo News (o null si no lo encuentra)
            onSuccess={() => {
                setOpenModal(false); 
                loadNews();          
            }}
          />
      )}
    </>
  );
};