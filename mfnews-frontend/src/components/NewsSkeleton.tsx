import { Grid as Grid, Skeleton, Box } from '@mui/material'; 


export const NewsSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="60%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};