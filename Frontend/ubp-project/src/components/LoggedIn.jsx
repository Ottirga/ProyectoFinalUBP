import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LoggedIn = () => {

  return (
    <Box sx={{ 
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
     }}>
      <Paper
        sx={{
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '8px'
        }}
      >
      
      <Typography variant="h4">Has Iniciado Sesión</Typography>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Haz clic en "Mis Libros" para ver la colección de libros.
      </Typography>
      </Paper>
    </Box>
  );
};

export default LoggedIn;