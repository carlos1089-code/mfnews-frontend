import { Card, CardContent, CardMedia, Typography, CardActionArea, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Recibimos la noticia completa como "prop"
export const NewsCard = ({ news }) => {
  const navigate = useNavigate();

  // Función para cortar el texto si es muy largo (Preview)
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* CardActionArea hace que toda la tarjeta sea clickeable */}
      <CardActionArea onClick={() => navigate(`/news/${news.id}`)}>
        
        {/* Imagen de la noticia */}
        <CardMedia
          component="img"
          height="200"
          image={news.image_url || "https://via.placeholder.com/300"} 
          alt={news.title}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          {/* Autor y Fecha (Pequeño arriba) */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
                {new Date(news.date).toLocaleDateString()}
            </Typography>
            <Chip label={news.author} size="small" color="primary" variant="outlined" />
          </Box>

          {/* Título */}
          <Typography gutterBottom variant="h6" component="div" sx={{ lineHeight: 1.2, mb: 2 }}>
            {news.title}
          </Typography>

          {/* Cuerpo (Resumen cortado a 100 caracteres) */}
          <Typography variant="body2" color="text.secondary">
            {truncate(news.body, 100)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};