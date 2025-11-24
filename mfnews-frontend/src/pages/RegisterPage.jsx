// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import { useAuth } from '../Context/AuthContext'; // 👈 Importamos el Hook
import { toast } from 'sonner';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth(); // 👈 Usamos la nueva función del contexto
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga local

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 👇 Lógica limpia: Delegamos al contexto
    const result = await signUp(formData.name, formData.email, formData.password);
    
    setLoading(false);

    if (result.success) {
      // Si hubo auto-login en el context, al ir al Home ya estaremos logueados
      toast.success('¡Usuario creado con exito!');
      navigate('/'); 
    } else {
      setError(result.error);
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

            <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth 
                disabled={loading} // Feedback visual
                sx={{ mt: 1 }}
            >
                {loading ? 'Creando cuenta...' : 'Registrarse'}
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