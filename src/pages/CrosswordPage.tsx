import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { supabase } from '../services/supabase'
import Crossword from '@jaredreisinger/react-crossword'

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

export default function CrosswordPage() {
  const { id } = useParams() // Obtener el id de la URL
  const navigate = useNavigate() // Hook para navegar entre páginas
  const [crosswordData, setCrosswordData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInstructions, setShowInstructions] = useLocalStorage(
    'showInstructions',
    true
  )
  const [instructionsOpen, setInstructionsOpen] = useState(false)

  useEffect(() => {
    // Función para cargar el crucigrama específico de la base de datos
    const fetchCrossword = async () => {
      const { data, error } = await supabase
        .from('crosswords')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error al cargar el crucigrama:', error)
      } else {
        setCrosswordData(data)
      }

      setLoading(false)
    }

    fetchCrossword()
  }, [id])

  // Manejar el cierre del diálogo de instrucciones
  const handleCloseInstructions = () => {
    setShowInstructions(false)
    setInstructionsOpen(false)
  }

  // Mostrar el diálogo de instrucciones manualmente
  const handleOpenInstructions = () => {
    setInstructionsOpen(true)
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
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
        {crosswordData ? (
          <>
            <Typography component='h1' variant='h5' gutterBottom>
              {crosswordData.title}
            </Typography>
            <Typography variant='body1' color='textSecondary' gutterBottom>
              {crosswordData.description}
            </Typography>
            <Box sx={{ width: '100%', mt: 4 }}>
              <Crossword
                data={crosswordData.data}
                acrossLabel='Horizontal'
                downLabel='Vertical'
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant='contained'
                onClick={() => navigate('/crosswords')}
              >
                Volver a la Lista de Crucigramas
              </Button>
              <Button variant='outlined' onClick={handleOpenInstructions}>
                Ver Instrucciones
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant='body1' color='textSecondary'>
            No se pudo cargar el crucigrama.
          </Typography>
        )}

        {/* Diálogo de Instrucciones */}
        <Dialog
          open={showInstructions || instructionsOpen}
          onClose={handleCloseInstructions}
        >
          <DialogTitle>Instrucciones del Crucigrama</DialogTitle>
          <DialogContent dividers>
            <Typography variant='body2' color='textSecondary' gutterBottom>
              Para jugar el crucigrama, selecciona las pistas de las filas
              (Horizontal) o columnas (Vertical). Completa cada palabra en el
              crucigrama con la respuesta correcta. Puedes cambiar tu respuesta
              en cualquier momento. ¡Diviértete y buena suerte!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInstructions} color='primary'>
              Entendido
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}
