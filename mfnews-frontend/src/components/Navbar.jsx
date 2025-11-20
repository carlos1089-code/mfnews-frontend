import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NewsModal } from './NewsModal'; // Importamos el modal
import newsApi from '../api/newsApi'; // Importamos la API

export const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Estado para abrir/cerrar modal

  // Lógica para CREAR noticia (POST)
  const handleCreateNews = async (values) => {
    try {
      await newsApi.post('/', values);
      alert('Noticia creada con éxito!');
      // Recargar la página para ver la nueva noticia (o usar contexto para ser más pro)
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert('Error al crear la noticia');
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#D32F2F' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              MFNews
            </Typography>

            <Box>
              {/* Al hacer click, ponemos setOpen(true) */}
              <Button 
                  variant="contained" 
                  sx={{ color: '#D32F2F', bgcolor: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#ffebee' }}}
                  onClick={() => setOpen(true)} 
              >
                Nueva Noticia
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* El Modal vive aquí, pero está oculto hasta que open=true */}
      <NewsModal 
        open={open} 
        handleClose={() => setOpen(false)} 
        onSubmit={handleCreateNews} 
        initialValues={null} // Null significa "Crear" (formulario vacío)
      />
    </>
  );
};