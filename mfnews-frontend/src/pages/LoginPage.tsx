import { useState, type ChangeEvent, type FormEvent } from 'react'; // Importamos tipos de eventos de React
import { TextField, Button, Alert, Box, Typography, Link as MuiLink } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout.tsx';
import { useAuth } from '../Context/AuthContext.tsx'; 

// 1. Definimos la interfaz para el estado de las credenciales
interface CredentialsState {
    email: string;
    password: string;
}

export const LoginPage = () => {
    const navigate = useNavigate();
    // useAuth ya devuelve la función signIn tipada
    const { signIn } = useAuth(); 
    
    // 2. Tipamos el estado de las credenciales
    const [credentials, setCredentials] = useState<CredentialsState>({ email: '', password: '' });
    
    // 3. Tipamos otros estados
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Tipamos el evento de cambio (Change event en un input HTML)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // Tipamos el evento de envío del formulario (Form event)
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn(credentials.email, credentials.password);

        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            // TS sabe que result.error es de tipo string | undefined
            setError(result.error || 'Error desconocido.'); 
        }
    };

    return (
        // AuthLayout ya fue tipado para recibir 'title: string'
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
                    onChange={handleChange} // onChange ya está tipado
                />
                <TextField 
                    label="Contraseña" 
                    name="password" 
                    type="password" 
                    fullWidth 
                    required 
                    value={credentials.password} 
                    onChange={handleChange} // onChange ya está tipado
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
                        {/* Usamos MuiLink para el estilo y RouterLink para la navegación */}
                        <MuiLink component={RouterLink} to="/register" underline="hover">
                            Regístrate aquí
                        </MuiLink>
                    </Typography>
                </Box>
            </Box>
        </AuthLayout>
    );
};