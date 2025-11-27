import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout.tsx";
import { useAuth } from "../Context/AuthContext.tsx";
import { toast } from "sonner";

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();

  const { signUp } = useAuth();

  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signUp(
      formData.name,
      formData.email,
      formData.password
    );

    setLoading(false);

    if (result.success) {
      toast.success("¡Usuario creado con exito!");
      navigate("/");
    } else {
      setError(result.error || "Error desconocido al registrar.");
    }
  };

  return (
    <AuthLayout title="Crear Cuenta">
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Registrate con tu email de <b>@mindfactory.ar</b> para obtener acceso de
        administrador.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
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
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </Button>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            ¿Ya tienes cuenta?{" "}
            <MuiLink component={RouterLink} to="/login" underline="hover">
              Inicia Sesión aquí
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};
