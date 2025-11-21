import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Stack, Avatar, IconButton, Tooltip } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { NewsModal } from './NewsModal';
import newsApi from '../api/newsApi';

export const Navbar = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // ESTADO DE SESIÓN
  // Leemos el localStorage cada vez que carga la Navbar
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // "ADMIN" o "USER"
  const name = localStorage.getItem('name');

  // FUNCIÓN DE CERRAR SESIÓN
  const handleLogout = () => {
    // 1. Borramos todo rastro del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    
    // 2. Redirigimos al login
    navigate('/login');
    // 3. Recargamos para limpiar estados de memoria
    window.location.reload();
  };

  const handleCreateNews = async (values, resetForm) => {
    setIsCreating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await newsApi.post('/', values);
      resetForm();
      setOpenModal(false);
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert('Error al crear la noticia');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#D32F2F' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            
            {/* LOGO */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              MFNews
            </Typography>

            {/* ZONA DE USUARIO */}
            <Box>
              {token ? (
                // --- SI ESTÁ LOGUEADO ---
                <Stack direction="row" spacing={2} alignItems="center">
                  
                  {/* Botón Crear (Solo Admin) */}
                  {role === 'ADMIN' && (
                    <Button 
                        variant="contained" 
                        sx={{ color: '#D32F2F', bgcolor: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#ffebee' }}}
                        onClick={() => setOpenModal(true)} 
                    >
                      Nueva Noticia
                    </Button>
                  )}

                  {/* Nombre y Avatar */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ border: '1px solid #ef5350', borderRadius: 2, px: 1, py: 0.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#b71c1c', fontSize: 14 }}>
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
                        {name}
                    </Typography>
                  </Stack>

                  {/* Botón Salir */}
                  <Tooltip title="Cerrar Sesión">
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ) : (
                // --- SI NO ESTÁ LOGUEADO (INVITADO) ---
                <Stack direction="row" spacing={2}>
                  <Button color="inherit" component={Link} to="/login">
                    Ingresar
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    component={Link} 
                    to="/register"
                    sx={{ borderColor: 'white', '&:hover': { borderColor: '#ffcdd2', bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    Registrarse
                  </Button>
                </Stack>
              )}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* MODAL DE CREACIÓN (Solo renderiza si hay token, por seguridad visual) */}
      {token && (
        <NewsModal 
            open={openModal} 
            handleClose={() => setOpenModal(false)} 
            onSubmit={handleCreateNews} 
            initialValues={null}
            isLoading={isCreating}
        />
      )}
    </>
  );
};