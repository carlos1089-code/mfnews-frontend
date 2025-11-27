import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Importaciones de componentes propios
import { Navbar } from "../components/Navbar.tsx";
import { NewsModal } from "../components/NewsModal.tsx";
import { toast } from "sonner";

// Servicios y Hooks
import { NewsService } from "../api/newsService.ts";
import { useAuth } from "../Context/AuthContext.tsx";
import type { News } from "../types/index.ts";

interface DetailParams extends Record<string, string | undefined> {
  id: string;
}

export const DetailPage = () => {
  const { id } = useParams<DetailParams>();
  const navigate = useNavigate();

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const loadNews = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setError("ID de noticia no encontrado.");
      return;
    }

    try {
      const data = await NewsService.getById(id);
      setNews(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la noticia.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadNews();
  }, [id, loadNews]);

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm("¿Seguro que quieres eliminar esta noticia?")) {
      try {
        await NewsService.delete(id);
        toast.success("Noticia eliminada correctamente");
        navigate("/");
      } catch (err) {
        console.error(err);
        toast.error("Error: No tienes permiso o falló el servidor");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !news) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">{error || "Noticia no disponible"}</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Volver al inicio
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
            Volver
          </Button>

          {isAdmin && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setOpenModal(true)}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            </Stack>
          )}
        </Box>

        <article>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Chip label={news.author} color="primary" size="small" />
            <Typography variant="caption" color="text.secondary">
              {new Date(news.date || Date.now()).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Stack>

          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            {news.title}
          </Typography>

          <Box
            component="img"
            src={news.image_url || "https://via.placeholder.com/800"}
            alt={news.title}
            sx={{
              width: "100%",
              height: { xs: "250px", md: "450px" },
              objectFit: "cover",
              borderRadius: 2,
              mb: 4,
              boxShadow: 3,
            }}
          />

          <Typography
            variant="body1"
            sx={{ fontSize: "1.1rem", lineHeight: 1.8, whiteSpace: "pre-wrap" }}
          >
            {news.body}
          </Typography>
        </article>

        <Divider sx={{ my: 4 }} />
      </Container>

      {isAdmin && news && (
        <NewsModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          initialValues={news}
          onSuccess={() => {
            setOpenModal(false);
            loadNews();
            toast.success("Noticia actualizada");
          }}
        />
      )}
    </>
  );
};
