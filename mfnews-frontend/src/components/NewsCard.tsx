import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// IMPORTAMOS LA INTERFAZ
// IMPORTAMOS LA INTERFAZ
import type { News } from "../types/index.ts";

// Definimos qué props recibe este componente
interface NewsCardProps {
  news: News;
}

export const NewsCard = ({ news }: NewsCardProps) => {
  const navigate = useNavigate();

  const newsId = news.id || news.id;

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea onClick={() => navigate(`/news/${newsId}`)}>
        <CardMedia
          component="img"
          height="200"
          image={news.image_url || "https://via.placeholder.com/300"}
          alt={news.title}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {new Date(news.date || Date.now()).toLocaleDateString()}
            </Typography>
            <Chip
              label={news.author}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ lineHeight: 1.2, mb: 2 }}
          >
            {news.title}
          </Typography>

          {news.subtitle && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 1.5, fontStyle: "italic" }}
            >
              {news.subtitle}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary">
            {truncate(news.body, 100)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
