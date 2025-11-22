import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import newsApi from '../api/newsApi'; // Usamos la instancia configurada
import { AuthLayout } from '../layout/AuthLayout';
import { useAuth } from '../Context/AuthContext'; // 👈 Importamos el Hook

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 Usamos 'login' para auto-loguear al registrarse
  
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
    setError('');

    try {
      // Nota: Ajusta la ruta si tu backend usa /auth/register
      // Si newsApi ya tiene la base URL, solo pon la ruta relativa.
      const response = await newsApi.post('/auth/register', formData);
      
      // 👇 AUTO-LOGIN:
      // Si el registro devuelve el usuario y token, iniciamos sesión directamente.
      // Si tu backend solo devuelve "OK", entonces redirige al login: navigate('/login')
      if (response.data.token && response.data.user) {
          login(response.data.user, response.data.token);
          alert(`¡Bienvenido ${response.data.user.name}!`);
          navigate('/'); 
      } else {
          // Caso alternativo si el backend no devuelve token al registrar
          alert('Registro exitoso. Por favor inicia sesión.');
          navigate('/login');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al registrarse. Verifica los datos.');
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

            <Box sx={{ textAlign: 'center', mt: 2 }}>
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