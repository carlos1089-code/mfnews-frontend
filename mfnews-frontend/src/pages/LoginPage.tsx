import { useState, type ChangeEvent, type FormEvent } from 'react'; 
import { TextField, Button, Alert, Box, Typography, Link as MuiLink } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout.tsx';
import { useAuth } from '../Context/AuthContext.tsx'; 

interface CredentialsState {
    email: string;
    password: string;
}

export const LoginPage = () => {
    const navigate = useNavigate();

    const { signIn } = useAuth(); 
    
 
    const [credentials, setCredentials] = useState<CredentialsState>({ email: '', password: '' });
    
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn(credentials.email, credentials.password);

        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Error desconocido.'); 
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
                    disabled={loading}
                    sx={{ mt: 1 }}
                >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2">
                        ¿No tienes cuenta?{' '}
                        
                        <MuiLink component={RouterLink} to="/register" underline="hover">
                            Regístrate aquí
                        </MuiLink>
                    </Typography>
                </Box>
            </Box>
        </AuthLayout>
    );
};