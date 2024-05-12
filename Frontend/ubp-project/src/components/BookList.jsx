import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Modal, TextField, Typography, Paper } from '@mui/material';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [newBook, setNewBook] = useState({ name: '', description: '' });
  const [bookToDelete, setBookToDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchBooks = async (page) => {
    try {
      const response = await axios.get('/books', { params: { page, limit: 10 } });
      setBooks(response.data.books || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      setError('Error fetching books');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
    setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleAddBook = async () => {
    try {
      await axios.post('/books', newBook);
      setAddModalOpen(false);
      setNewBook({ name: '', description: '' });
      fetchBooks(page);
    } catch (error) {
      setError('Error adding book');
      console.error(error);
    }
  };

  const handleEditBook = async () => {
    if (bookToEdit) {
      try {
        await axios.put(`/books/${bookToEdit.id}`, bookToEdit);
        setEditModalOpen(false);
        setBookToEdit(null);
        fetchBooks(page);
      } catch (error) {
        setError('Error editing book')
        console.error(error);
      }
    }
  };

  const handleDeleteBook = async () => {
    if (bookToDelete) {
      try {
        await axios.delete(`/books/${bookToDelete.id}`);
        setBookToDelete(null);
        fetchBooks(page);
      } catch (error) {
        setError('Error deleting book');
        console.error(error);
      }
    }
  };

  return (
    <Box
    sx={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingTop: '4rem',
      textAlign: 'center', 
      overflowY: 'auto',
   }}>
      <Paper
      sx= {{
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px'
      }}
      >
      <Typography variant="h4">Lista de Libros</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#af3b4e',
          color: '#ffffff',
        }}
        onClick={() => setAddModalOpen(true)}
      >
        Agregar Libro
      </Button>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
            <TableCell colSpan={3} align="center">
              No se encontraron libros
            </TableCell>
          </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.description}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => {
                      setBookToEdit(book);
                      setEditModalOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    color="error"
                    onClick={() => {
                      setBookToDelete(book);
                    }}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <Box>
        <Button onClick={handlePreviousPage} disabled={page === 1}>Anterior</Button>
        <Button onClick={handleNextPage} disabled={page >= totalPages}>Siguiente</Button>
      </Box>

      <Modal
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: 'background.paper', padding: 4, borderRadius: 2 }}>
          <Typography variant="h6">Agregar Libro</Typography>
          <TextField
            label="Nombre"
            fullWidth
            value={newBook.name}
            onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
          />
          <TextField
            label="Descripción"
            fullWidth
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
          />
          <Button onClick={handleAddBook}>Agregar</Button>
          <Button onClick={() => setAddModalOpen(false)}>Cancelar</Button>
        </Box>
      </Modal>

      <Modal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: 'background.paper', padding: 4, borderRadius: 2 }}>
          <Typography variant="h6">Editar Libro</Typography>
          <TextField
            label="Nombre"
            fullWidth
            value={bookToEdit?.name || ''}
            onChange={(e) => {
              setBookToEdit({
                ...bookToEdit,
                name: e.target.value,
              });
            }}
          />
          <TextField
            label="Descripción"
            fullWidth
            value={bookToEdit?.description || ''}
            onChange={(e) => {
              setBookToEdit({
                ...bookToEdit,
                description: e.target.value,
              });
            }}
          />
          <Button onClick={handleEditBook}>Guardar</Button>
          <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
        </Box>
      </Modal>

      <Modal
        open={bookToDelete !== null}
        onClose={() => setBookToDelete(null)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: 'background.paper', padding: 4, borderRadius: 2 }}>
          <Typography variant="h6">
            ¿Estás seguro que quieres eliminar "{bookToDelete?.name}"?
          </Typography>
          <Button
            color="error"
            onClick={handleDeleteBook}
          >
            Sí
          </Button>
          <Button
            onClick={() => setBookToDelete(null)}
          >
            No
          </Button>
        </Box>
      </Modal>
      </Paper>
    </Box>
  );
};

export default BookList;