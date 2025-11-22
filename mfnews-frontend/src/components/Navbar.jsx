import { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, Stack, 
  Avatar, IconButton, Tooltip 
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

// Importamos nuestra API y Contexto
import newsApi from '../api/newsApi';
import { useAuth } from '../Context/AuthContext';
import { NewsModal } from './NewsModal';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth(); // 👈 MAGIA DEL CONTEXTO
  
  // Estado local solo para manejar la visualización del modal
  const [openModal, setOpenModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Lógica para cerrar sesión
  const handleLogout = () => {
    logout(); // 1. Limpia el estado global y localStorage
    navigate('/login'); // 2. Redirige sin recargar la página
  };

  // Lógica para crear noticia (Solo Admins)
  const handleCreateNews = async (values, resetForm) => {
    setIsCreating(true);
    try {
      // Simulamos un pequeño delay para ver el spinner
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await newsApi.post('/', values);
      
      resetForm();
      setOpenModal(false);
      
      // OPCIONAL: Aquí podrías disparar una recarga de las noticias
      // si usaras un Context de Noticias o React Query. 
      // Por ahora, recargamos el home suavemente navegando:
      navigate('/'); 
      window.location.reload(); // Fallback temporal para refrescar la lista
      
    } catch (error) {
      console.error(error);
      alert('Error al crear la noticia');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* position="static" hace que fluya con la página. 
          color="primary" usa el rojo definido en tu AppTheme. */}
      <AppBar position="static" color="primary" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            
            {/* LOGO / TÍTULO */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => navigate('/')}
            >
              MFNews
            </Typography>

            {/* ZONA DE USUARIO */}
            <Box>
              {isAuthenticated ? (
                // --- VISTA LOGUEADO ---
                <Stack direction="row" spacing={2} alignItems="center">
                  
                  {/* Botón Crear (Solo visible si el rol es ADMIN) */}
                  {user?.role === 'ADMIN' && (
                    <Button 
                        variant="contained" 
                        sx={{ 
                          color: 'primary.main', // Texto rojo
                          bgcolor: 'white',      // Fondo blanco
                          fontWeight: 'bold', 
                          '&:hover': { bgcolor: '#ffebee' }
                        }}
                        onClick={() => setOpenModal(true)} 
                    >
                      Nueva Noticia
                    </Button>
                  )}

                  {/* Chip de Usuario (Avatar + Nombre) */}
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    alignItems="center" 
                    sx={{ 
                      border: '1px solid rgba(255,255,255,0.5)', 
                      borderRadius: 2, 
                      px: 1.5, 
                      py: 0.5 
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#b71c1c', fontSize: 14 }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
                        {user?.name}
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
                // --- VISTA INVITADO (NO LOGUEADO) ---
                <Stack direction="row" spacing={2}>
                  <Button color="inherit" component={Link} to="/login">
                    Ingresar
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    component={Link} 
                    to="/register"
                    sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
                  >
                    Registrarse
                  </Button>
                </Stack>
              )}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* MODAL DE CREACIÓN (Renderizado condicional) */}
      {isAuthenticated && user?.role === 'ADMIN' && (
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