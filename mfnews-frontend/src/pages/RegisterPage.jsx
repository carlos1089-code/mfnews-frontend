import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import newsApi from '../api/newsApi'; 

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
      // NOTA: newsApi tiene baseURL en /api/news, así que sobreescribimos la URL
      // o llamamos a axios directo. Para ser prolijos, usemos newsApi con la ruta completa relativa al back
      // Pero como tu newsApi apunta a /api/news, mejor hacemos un post a la ruta de auth manual:
      
      // Ajuste rápido: axios directo o configurar otra instancia. 
      // Asumamos que el back corre en localhost:3000
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
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box 
        component="form" 
        onSubmit={handleRegister} 
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}
      >
        <Typography variant="h4" align="center" color="primary" fontWeight="bold">
          Crear Cuenta
        </Typography>
        
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
          Registrate con tu email de <b>@mindfactory.ar</b> para obtener acceso de administrador.
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField 
          label="Nombre Completo" 
          name="name" 
          required 
          value={formData.name} 
          onChange={handleChange} 
        />
        <TextField 
          label="Email" 
          name="email" 
          type="email" 
          required 
          value={formData.email} 
          onChange={handleChange} 
        />
        <TextField 
          label="Contraseña" 
          name="password" 
          type="password" 
          required 
          value={formData.password} 
          onChange={handleChange} 
        />

        <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
          Registrarse
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login">
              Inicia Sesión aquí
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};