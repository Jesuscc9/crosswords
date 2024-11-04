import React, { useState, useEffect } from 'react'
import Crossword from '@jaredreisinger/react-crossword'
import { ThemeProvider } from '@jaredreisinger/react-crossword'
import {
  Container,
  Grid2,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import Box from '@mui/material/Box'
import useSession from './hooks/useSession'
import { LogoutButton } from './components/LogoutButton'
import { AppLayout } from './components/AppLayout'

// Hook personalizado para usar localStorage
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

const data = {
  across: {
    1: {
      clue: 'El rol encargado de maximizar el valor del producto (13)',
      answer: 'PRODUCTOWNER',
      row: 3,
      col: 2
    },
    4: {
      clue: 'Período de tiempo en el cual el equipo desarrolla una funcionalidad (6)',
      answer: 'SPRINT',
      row: 5,
      col: 5
    },
    6: {
      clue: 'Evento clave donde el equipo reflexiona y adapta su trabajo (13)',
      answer: 'RETROSPECTIVA',
      row: 7,
      col: 2
    }
  },
  down: {
    1: {
      clue: 'Lista de tareas que deben completarse en el sprint (7)',
      answer: 'BACKLOG',
      row: 0,
      col: 0
    },
    2: {
      clue: 'Rol del líder facilitador del equipo Scrum (11)',
      answer: 'SCRUMMASTER',
      row: 0,
      col: 2
    },
    5: {
      clue: 'Evento donde se revisa el progreso hacia el objetivo del sprint (13)',
      answer: 'SPRINTREVIEW',
      row: 3,
      col: 6
    }
  }
}

export default function App() {
  const { session } = useSession()
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useLocalStorage(
    'welcomeDialogShown',
    true
  )
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useLocalStorage(
    'instructionsDialogShown',
    false
  )

  useEffect(() => {
    if (welcomeDialogOpen) {
      setInstructionsDialogOpen(false)
    }
  }, [welcomeDialogOpen])

  const handleWelcomeClose = () => {
    setWelcomeDialogOpen(false)
    setInstructionsDialogOpen(true)
  }

  const handleInstructionsClose = () => {
    setInstructionsDialogOpen(false)
  }

  const handleOpenInstructions = () => {
    setInstructionsDialogOpen(true)
  }

  return (
    <Grid2
      container
      display='grid'
      sx={{
        placeItems: 'center'
      }}
    >
      <Box width={500} maxWidth={'96vw'}>
        <Typography
          variant='h4'
          fontWeight='bold'
          textAlign='center'
          gutterBottom
          mb={4}
        >
          Crucigrama de Scrum
        </Typography>
        <ThemeProvider
          theme={{
            textColor: '#000'
          }}
        >
          <Crossword acrossLabel='Horizontal' data={data} />
        </ThemeProvider>
        <Container
          sx={{
            width: '100%',
            textAlign: 'center',
            mt: 2
          }}
        >
          {session && <LogoutButton />}
          <Button
            variant='outlined'
            onClick={handleOpenInstructions}
            sx={{ mt: 2 }}
          >
            Instrucciones
          </Button>
        </Container>

        {/* Dialogo de bienvenida */}
        <Dialog open={welcomeDialogOpen} onClose={handleWelcomeClose}>
          <DialogTitle>Bienvenido a la aplicación de Crucigramas!</DialogTitle>
          <DialogContent>
            <Typography>
              ¡Bienvenido! Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Ratione a aut ducimus. Amet distinctio autem, magni impedit
              esse, ipsam sequi asperiores excepturi quis commodi aliquam
              numquam eaque rem nesciunt! Excepturi?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleWelcomeClose} color='primary'>
              Continuar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialogo de instrucciones */}
        <Dialog open={instructionsDialogOpen} onClose={handleInstructionsClose}>
          <DialogTitle>Instrucciones</DialogTitle>
          <DialogContent>
            <Typography>
              Rellena cada espacio del crucigrama con la palabra correcta
              utilizando las pistas proporcionadas. Haz clic en las celdas para
              comenzar a escribir.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInstructionsClose} color='primary'>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Grid2>
  )
}
