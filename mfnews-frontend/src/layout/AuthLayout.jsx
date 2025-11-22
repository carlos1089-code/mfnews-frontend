// src/layout/AuthLayout.jsx
import { Container, Box, Typography, Paper } from '@mui/material';

export const AuthLayout = ({ children, title }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            borderRadius: 2,
            gap: 2
          }}
        >
          <Typography component="h1" variant="h4" align="center" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
            {title}
          </Typography>
          
          {children}
          
        </Paper>
      </Box>
    </Container>
  );
};