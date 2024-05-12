import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/Login';
import BookList from './components/BookList';
import LoggedIn from './components/LoggedIn';
import { Box } from '@mui/material';
import './App.css';

const BackgroundWrapper = ({ children }) => {
  return (
    <Box
    sx={{
      backgroundImage: 'url(/biblio.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat', 
      minHeight: '100vh', 
      width: '100%', 
      position: 'relative', 
    }}
    >
      {children} 
    </Box>
  );
};

const Home = () => {
  return null};


const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <BackgroundWrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loggedin" element={<LoggedIn />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/books" element={<PrivateRoute><BookList /></PrivateRoute>} />
        </Routes>
        </BackgroundWrapper>
      </Router>
    </AuthProvider>
  );


export default App;