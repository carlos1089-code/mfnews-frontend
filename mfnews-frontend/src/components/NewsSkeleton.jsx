import { Grid, Skeleton, Box } from '@mui/material';

export const NewsSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {/* Generamos un array de 6 elementos vacíos para simular 6 tarjetas */}
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Simula la imagen */}
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
            {/* Simula el texto */}
            <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="60%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};