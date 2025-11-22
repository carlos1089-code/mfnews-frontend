import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios'; // O tu newsApi si prefieres
import { AuthLayout } from '../layout/AuthLayout';
import { useAuth } from '../Context/AuthContext'; // 👈 Importamos el Hook del Contexto

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 Extraemos la función 'login' del contexto
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Ajusta la URL según tu backend (usamos axios directo si la ruta es distinta a /news)
      const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
      
      // 👇 AQUÍ ESTÁ EL CAMBIO CLAVE:
      // En lugar de guardar en localStorage a mano, le pasamos los datos al Contexto.
      // El Contexto se encarga de actualizar el estado global y guardar en storage.
      login(response.data.user, response.data.token);

      // Redirigimos al Home. Como el estado cambió, la Navbar se actualiza sola.
      navigate('/');
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Email o contraseña incorrectos');
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión">
        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
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

            <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth 
                sx={{ mt: 1 }}
            >
                Ingresar
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
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