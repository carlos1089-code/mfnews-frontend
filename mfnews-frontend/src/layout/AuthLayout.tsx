import { Container, Box, Typography, Paper } from '@mui/material';
import {type  ReactNode } from 'react'; // Importamos el tipo para 'children'

// 1. Definimos la interfaz para las props
interface AuthLayoutProps {
  children: ReactNode; // El contenido que va dentro del layout
  title: string;       // El título de la página (e.g., "Login", "Registro")
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            borderRadius: 2,
            gap: 2
          }}
        >
          {/* Usamos el título tipado */}
          <Typography component="h1" variant="h4" align="center" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
            {title}
          </Typography>
          
          {/* El contenido hijo */}
          {children}
          
        </Paper>
      </Box>
    </Container>
  );
};