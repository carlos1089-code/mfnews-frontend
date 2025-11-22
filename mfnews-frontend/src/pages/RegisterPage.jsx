import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import newsApi from '../api/newsApi'; 
import { AuthLayout } from '../layout/AuthLayout';

export const RegisterPage = () => {
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
    
      const response = await newsApi.post('http://localhost:3000/api/auth/register', formData);
      
      // Guardamos sesión (Auto-login)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('name', response.data.user.name);

      alert(`¡Bienvenido ${response.data.user.name}! Tu rol es: ${response.data.user.role}`);
      
      navigate('/'); // Redirigir al Home
      window.location.reload();
    } catch (err) {
      console.error(err);
      // Capturamos el mensaje de error del backend (ej: "Email ya existe")
      setError(err.response?.data?.error || 'Error al registrarse');
      console.log(error)
    }
  };

  return (
    <AuthLayout title="Crear Cuenta">
        
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 1 }}>
          Registrate con tu email de <b>@mindfactory.ar</b> para obtener acceso de administrador.
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <TextField 
                label="Nombre Completo" 
                name="name" 
                fullWidth 
                required 
                value={formData.name} 
                onChange={handleChange} 
            />
            <TextField 
                label="Email" 
                name="email" 
                type="email" 
                fullWidth 
                required 
                value={formData.email} 
                onChange={handleChange} 
            />
            <TextField 
                label="Contraseña" 
                name="password" 
                type="password" 
                fullWidth 
                required 
                value={formData.password} 
                onChange={handleChange} 
            />

            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
                Registrarse
            </Button>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2">
                    ¿Ya tienes cuenta?{' '}
                    <Link component={RouterLink} to="/login" underline="hover">
                        Inicia Sesión aquí
                    </Link>
                </Typography>
            </Box>
        </Box>
    </AuthLayout>
  );
};