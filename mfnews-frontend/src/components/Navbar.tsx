import { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, Stack, 
  Avatar, IconButton, Tooltip 
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

// Importamos el hook y el modal
import { useAuth } from '../Context/AuthContext.tsx';
import { NewsModal } from './NewsModal.tsx';

export const Navbar = () => {
  const navigate = useNavigate();
  
  // Aquí TS intentará inferir los tipos de useAuth.
  // Cuando migremos AuthContext, esto tendrá autocompletado automático.
  const { user, logout, isAuthenticated } = useAuth();
  
  // Tipado explícito del estado (buena práctica en TS)
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
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
                <Stack direction="row" spacing={2} alignItems="center">
                  
                  {/* Botón Crear (Solo visible si el rol es ADMIN) */}
                  {/* El operador ?. es vital aquí para que TS no se queje si user es null */}
                  {user?.role === 'ADMIN' && (
                    <Button 
                        variant="contained" 
                        sx={{ 
                          color: 'primary.main',
                          bgcolor: 'white',
                          fontWeight: 'bold', 
                          '&:hover': { bgcolor: '#ffebee' }
                        }}
                        onClick={() => setOpenModal(true)} 
                    >
                      Nueva Noticia
                    </Button>
                  )}

                  {/* Chip de Usuario */}
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
                        {/* Verificamos que user y user.name existan */}
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
                // --- VISTA INVITADO ---
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

      {isAuthenticated && user?.role === 'ADMIN' && (
        <NewsModal 
            open={openModal} 
            handleClose={() => setOpenModal(false)} 
            onSuccess={() => {
               setOpenModal(false); 
               window.location.reload(); 
            }}
            initialValues={null} 
        />
      )}
    </>
  );
};