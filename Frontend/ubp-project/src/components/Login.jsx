import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

axios.defaults.baseURL = 'http://127.0.0.1:8000'


const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState ('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      setError('Invalid Email');
      return;
    }
  
    try {
      const response = await axios.post('/user/login', { email, password });
      if (response.data.message === "Login successful") {       
       login(response.data.user);  
       navigate('/loggedin');    
      } else {
        setError('Incorrect credentials');
      }
    } catch (error) {
      setError('An error occourred while trying to log in. Please try again');
    }
  };

  return (
    <Container 
    sx= {{
      height: '100vh',
      width: '60vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth:'xs'}}
      >
      <Box sx={{ 
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#b5b5b5',
        borderRadius: '10px',
      }}>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Contraseña'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            sx={{ mt: 2, mb: 2, backgroundColor: '#af3b4e' }}
          >
            Iniciar Sesión
          </Button>
          {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;