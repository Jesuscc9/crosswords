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
import useLocalStorage from '../hooks/useLocalStorage'
import useSession from '../hooks/useSession'
import { theme } from '../components/Theme'

export default function CrosswordPage() {
  const { crosswordId, crosswordTopic, crosswordDifficulty } = useParams() // Obtener el id de la URL
  const navigate = useNavigate() // Hook para navegar entre páginas
  const [crosswordData, setCrosswordData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInstructions, setShowInstructions] = useLocalStorage(
    'showInstructions',
    true
  )
  const [isFetchingLastProgress, setIsFetchingLastProgress] = useState(false)
  const [prevProgressId, setPrevProgressId] = useState<number | undefined>(
    undefined
  )

  const { session } = useSession()

  const [showNotFoundRoute, setShowNotFoundRoute] = useState(false)

  const [instructionsOpen, setInstructionsOpen] = useState(false)

  useEffect(() => {
    if (!crosswordTopic || !crosswordDifficulty || !crosswordId) {
      setShowNotFoundRoute(true)
      return
    }

    // Función para cargar el crucigrama específico de la base de datos
    const fetchCrossword = async () => {
      const { data, error } = await supabase
        .from('crosswords')
        .select('*')
        .eq('id', crosswordId)
        .eq('topic', crosswordTopic?.toUpperCase())
        .eq('difficulty', crosswordDifficulty?.toUpperCase())
        .single()

      if (error) {
        console.error('Error al cargar el crucigrama:', error)
      } else {
        setCrosswordData(data)
      }

      setLoading(false)
    }

    fetchCrossword()
  }, [crosswordId, crosswordDifficulty, crosswordTopic])

  useEffect(() => {
    if (!session) return

    setIsFetchingLastProgress(true)

    const fetchLastProgress = async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('crossword_id', Number(crosswordId))
        .eq('profile_id', session?.user.id)
        .limit(1)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al cargar el progreso del crucigrama:', error)
      } else {
        console.log('prev')

        if (data.length > 0) {
          const prevProgress = data[0].current_answers as string
          setPrevProgressId(data[0].id)

          console.log({ prevProgress })

          window.localStorage.setItem(
            `crossword-${crosswordId}`,
            JSON.parse(prevProgress)
          )
        }

        console.log(data)
      }

      setIsFetchingLastProgress(false)
    }

    fetchLastProgress()
  }, [crosswordId, session])

  const handleUpdateCrosswordProgress = async () => {
    if (!session) return

    console.log('hola')
    // Actualizar el progreso del crucigrama
    console.log('Progreso actualizado')

    const data = window.localStorage.getItem(`crossword-${crosswordId}`)

    const { data: updated } = await supabase
      .from('user_progress')
      .upsert(
        {
          id: prevProgressId ?? undefined,
          crossword_id: Number(crosswordId),
          profile_id: session?.user.id,
          current_answers: JSON.stringify(data)
        },
        {
          onConflict: 'id'
        }
      )
      .select()

    console.log({ updated })

    if (updated?.length > 0) {
      window.localStorage.setItem(
        `crossword-${crosswordId}`,
        JSON.parse(updated[0]?.current_answers)
      )
    }
  }

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
    <Container
      className='nes-container is-dark !mx-auto max-w-[96%] !mb-20'
      component='main'
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {crosswordData || !isFetchingLastProgress ? (
          <>
            <Typography component='h1' variant='h5' gutterBottom>
              {crosswordData.title}
            </Typography>
            <Typography variant='body1' color='yellow' gutterBottom>
              {crosswordData.description}
            </Typography>
            <Box
              display='flex'
              sx={{
                width: '100%',
                mt: 4,
                [theme.breakpoints.down('md')]: {
                  flexDirection: 'column'
                }
              }}
            >
              <Crossword
                data={crosswordData.data}
                useStorage
                storageKey={`crossword-${crosswordId}`}
                acrossLabel='Horizontal'
                downLabel='Vertical'
                onCellChange={handleUpdateCrosswordProgress}
                theme={{
                  highlightBackground: 'orange'
                }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }} flexWrap='wrap'>
              <button
                className='nes-btn is-warning'
                onClick={() =>
                  navigate(
                    `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
                  )
                }
              >
                Volver a la Lista de Crucigramas
              </button>
              <button
                className='nes-btn is-primary'
                onClick={handleOpenInstructions}
              >
                Ver Instrucciones
              </button>
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
            <button
              className='nes-btn is-primary'
              onClick={handleCloseInstructions}
              color='primary'
            >
              Entendido
            </button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de Ruta no encontrada */}
        <Dialog open={showNotFoundRoute}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <Typography variant='body1'>
              No se encontró la ruta solicitada.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/crosswords')}>Volver</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}
