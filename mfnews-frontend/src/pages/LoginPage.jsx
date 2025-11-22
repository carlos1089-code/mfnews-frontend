import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { AuthLayout } from '../layout/AuthLayout';

export const LoginPage = () => {
  const navigate = useNavigate();
  
  // Estado para los inputs
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  // Estado para mensajes de error
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      // Usamos axios directo porque la URL es distinta a la de noticias
      const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
      
      // 1. Guardamos el token y datos del usuario en el navegador
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('name', response.data.user.name);

      // 2. Redirigimos al Home
      // Usamos window.location.reload() para asegurar que la Navbar se actualice y muestre los botones correctos
      navigate('/');
      window.location.reload();
      
    } catch (err) {
      console.error(err);
      // Mostramos el mensaje de error que viene del backend o uno genérico
      setError(err.response?.data?.error || 'Email o contraseña incorrectos');
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión">
        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={credentials.email}
                onChange={handleChange}
            />
            <TextField
                label="Contraseña"
                name="password"
                type="password"
                fullWidth
                required
                value={credentials.password}
                onChange={handleChange}
            />

            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
                Ingresar
            </Button>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2">
                    ¿No tienes cuenta?{' '}
                    <Link component={RouterLink} to="/register" underline="hover">
                        Regístrate aquí
                    </Link>
                </Typography>
            </Box>
        </Box>
    </AuthLayout>
  );
};