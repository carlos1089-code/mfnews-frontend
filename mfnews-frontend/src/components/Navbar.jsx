import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NewsModal } from './NewsModal';
import newsApi from '../api/newsApi';

export const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  // NUEVO ESTADO: Controla si estamos esperando a la API
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNews = async (values, resetForm) => {
    setIsCreating(true); // 1. Prende el spinner
    try {
      // Truco para Demo: Esperar 1 segundo artificialmente para que SE VEA el spinner
      await new Promise(resolve => setTimeout(resolve, 1000));

      await newsApi.post('/', values); // 2. Petición real al backend
      
      // 3. Éxito
      resetForm(); 
      setOpen(false); 
      
      // En lugar de alert, recargamos directo.
      // El usuario verá el spinner girar, el modal cerrarse y la página actualizarse.
      window.location.reload(); 
      
    } catch (error) {
      console.error(error);
      alert('Hubo un error al crear la noticia'); // Este alert sí dejalo por si falla
    } finally {
      setIsCreating(false); // Apaga el spinner
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#D32F2F' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6" component="div"
              sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              MFNews
            </Typography>

            <Box>
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

      <NewsModal 
        open={open} 
        handleClose={() => setOpen(false)} 
        onSubmit={handleCreateNews} 
        initialValues={null}
        isLoading={isCreating} // <--- 3. Pasamos el estado al modal
      />
    </>
  );
};