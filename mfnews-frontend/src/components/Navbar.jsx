import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    // AppBar: Barra superior estática. bgcolor: '#D32F2F' es el rojo del diseño.
    <AppBar position="static" sx={{ bgcolor: '#D32F2F' }}>
      <Container maxWidth="lg"> {/* Alinea el contenido con el resto de la web */}
        <Toolbar disableGutters>
          
          {/* TÍTULO / LOGO */}
          {/* flexGrow: 1 empuja todo lo demás a la derecha */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/')} // Al hacer clic, vuelve al inicio
          >
            MFNews
          </Typography>

          {/* BOTÓN DE ACCIÓN */}
          <Box>
            <Button 
                variant="contained" 
                // Estilo personalizado: Blanco con texto rojo para resaltar
                sx={{ 
                    color: '#D32F2F', 
                    bgcolor: 'white', 
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#ffebee' } // Efecto hover suave
                }}
                onClick={() => console.log("Abrir modal de crear")} // Lo conectaremos luego
            >
              Nueva Noticia
            </Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};