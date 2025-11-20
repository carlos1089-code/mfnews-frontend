import { Container, Typography, Box } from '@mui/material';

function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          MFNews Frontend
        </Typography>
        <Typography variant="body1">
          Sistema listo para empezar a programar.
        </Typography>
      </Box>
    </Container>
  );
}

export default App;