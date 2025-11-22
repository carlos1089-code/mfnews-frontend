// src/pages/LoginPage.jsx
import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import { useAuth } from '../Context/AuthContext'; 

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth(); // 👈 Usamos la nueva función 'signIn'
  
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Opcional: para deshabilitar el botón

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 👇 LLAMADA LIMPIA
    // La página le dice al contexto: "Intenta loguear a este tipo"
    const result = await signIn(credentials.email, credentials.password);

    setLoading(false);

    if (result.success) {
      navigate('/'); // Si salió bien, nos vamos
    } else {
      setError(result.error); // Si salió mal, mostramos el error que nos devolvió el Contexto
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
                disabled={loading} // Evita doble click
                sx={{ mt: 1 }}
            >
                {loading ? 'Ingresando...' : 'Ingresar'}
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