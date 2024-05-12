import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => navigate('/login');
  const handleShowBooks = () => navigate('/books');
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar sx={{ backgroundColor: '#af3b4e' }}>
      <Toolbar>
        <Typography variant="h4" component="div" style={{ flexGrow: 1 }}>
          UBP
        </Typography>
        {!isLoggedIn ? (
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        ) : (
          <>
            <Button color="inherit" onClick={handleShowBooks}>Mis Libros</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;