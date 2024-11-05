import React, { useEffect, useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

// Hook personalizado para gestionar localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export default function CrosswordsListPage() {
  const [crosswords, setCrosswords] = useState([])
  const [showWelcome, setShowWelcome] = useLocalStorage('showWelcome', true)

  useEffect(() => {
    // Función para cargar los crucigramas de la base de datos
    const fetchCrosswords = async () => {
      const { data, error } = await supabase.from('crosswords').select('*')
      if (error) {
        console.error('Error al cargar los crucigramas:', error)
      } else {
        setCrosswords(data)
      }
    }

    fetchCrosswords()
  }, [])

  const handleCloseWelcome = () => {
    setShowWelcome(false)
  }

  return (
    <Container component='main' maxWidth='md'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component='h1' variant='h5' gutterBottom>
          Lista de Crucigramas
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Dificultad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {crosswords.map((crossword) => (
                <TableRow key={crossword.id}>
                  <TableCell>{crossword.title}</TableCell>
                  <TableCell>{crossword.description}</TableCell>
                  <TableCell>{crossword.difficulty}</TableCell>
                  <TableCell>
                    <Button
                      variant='outlined'
                      component={Link}
                      to={`${crossword.id}`}
                    >
                      Ver Crucigrama
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Diálogo de Bienvenida */}
        <Dialog open={showWelcome} onClose={handleCloseWelcome}>
          <DialogTitle>Bienvenido a la Lista de Crucigramas</DialogTitle>
          <DialogContent dividers>
            <Typography variant='body2' color='textSecondary'>
              ¡Bienvenido! Aquí podrás ver y seleccionar diferentes crucigramas
              para jugar. Explora la lista y elige un crucigrama para comenzar.
              ¡Diviértete y disfruta del desafío!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseWelcome} color='primary'>
              Comenzar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}
