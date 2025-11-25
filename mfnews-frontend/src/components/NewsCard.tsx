import { Card, CardContent, CardMedia, Typography, CardActionArea, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// IMPORTAMOS LA INTERFAZ
// IMPORTAMOS LA INTERFAZ
import type { News } from '../types/index.ts'; 

// Definimos qué props recibe este componente
interface NewsCardProps {
    news: News;
}

export const NewsCard = ({ news }: NewsCardProps) => {
  const navigate = useNavigate();

  // SOLUCIÓN AL ERROR DE NAVEGACIÓN:
  // Detectamos si el backend envió '_id' (Mongo) o 'id'
  const newsId = news.id || news.id;

  // Tipamos los argumentos de la función auxiliar
  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Usamos newsId para la navegación segura */}
      <CardActionArea onClick={() => navigate(`/news/${newsId}`)}>
        
        {/* Imagen */}
        <CardMedia
          component="img"
          height="200"
          // TS sabe que image_url es string | undefined, el operador OR (||) maneja el fallback
          image={news.image_url || "https://via.placeholder.com/300"} 
          alt={news.title}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          {/* Header de la card */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
                {/* Manejo seguro de fecha por si es undefined */}
                {new Date(news.date || Date.now()).toLocaleDateString()}
            </Typography>
            <Chip label={news.author} size="small" color="primary" variant="outlined" />
          </Box>

          {/* Título */}
          <Typography gutterBottom variant="h6" component="div" sx={{ lineHeight: 1.2, mb: 2 }}>
            {news.title}
          </Typography>

          {/* Cuerpo */}
          <Typography variant="body2" color="text.secondary">
            {truncate(news.body, 100)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};