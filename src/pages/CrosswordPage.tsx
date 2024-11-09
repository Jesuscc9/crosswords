import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  debounce,
  Stack
} from '@mui/material'
import { ErrorDialog } from '../components/ErrorDialog'
import { supabase } from '../services/supabase'
import Crossword from '@jaredreisinger/react-crossword'
import useLocalStorage from '../hooks/useLocalStorage'
import useSession from '../hooks/useSession'
import { theme } from '../components/Theme'
import { Database } from '../types/db.types'
import { CluesInputOriginal } from '@jaredreisinger/react-crossword/dist/types'

type iCrossword = Database['public']['Tables']['crosswords']['Row']

// Función para convertir "HH:MM:SS" en segundos
function intervalToSeconds(interval: string): number {
  const [hours, minutes, seconds] = interval.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

// Función para convertir segundos en formato "HH:MM:SS"
function secondsToIntervalFormat(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00:00'
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${hours}:${minutes}:${secs}`
}

export default function CrosswordPage() {
  const { crosswordId, crosswordTopic, crosswordDifficulty } = useParams()
  const navigate = useNavigate()
  const [crosswordData, setCrosswordData] = useState<iCrossword>()
  const [loading, setLoading] = useState(true)
  const [displayTimeSpent, setDisplayTimeSpent] = useState<number>(0) // Tiempo para la UI
  const [dbUpdateTimeSpent, setDbUpdateTimeSpent] = useState<number>(0) // Tiempo para la BD
  const [timeLimit, setTimeLimit] = useState<number | null>(null) // Límite de tiempo en segundos
  const [noCluesLeft, setNoCluesLeft] = useState(false)
  const [showInstructions, setShowInstructions] = useLocalStorage(
    'showInstructions',
    true
  )
  const [isCompleted, setIsCompleted] = useState(false)

  const [usedClues, setUsedClues] = useState<
    Database['public']['Tables']['user_used_clues']['Row'][]
  >([])

  const [isFetchingLastProgress, setIsFetchingLastProgress] = useState(false)
  const [prevProgressId, setPrevProgressId] = useState<number | undefined>(
    undefined
  )
  const { session } = useSession()
  const [showNotFoundRoute, setShowNotFoundRoute] = useState(false)
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [timeExpired, setTimeExpired] = useState(false) // Estado para controlar el diálogo de tiempo agotado

  const storageKey = useMemo(
    () => `crossword-${crosswordId}-${session?.user.id}`,
    [crosswordId, session?.user]
  )

  useEffect(() => {
    if (!crosswordTopic || !crosswordDifficulty || !crosswordId) {
      setShowNotFoundRoute(true)
      return
    }

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
        setTimeLimit(
          data?.time_limit ? intervalToSeconds(data.time_limit as string) : 0
        )
      }

      setLoading(false)
    }

    fetchCrossword()
  }, [crosswordId, crosswordDifficulty, crosswordTopic])

  useEffect(() => {
    if (!session) return
    if (!crosswordData) return

    setIsFetchingLastProgress(true)

    const fetchLastProgress = async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('crossword_id', Number(crosswordId))
        .eq('profile_id', session?.user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Error al cargar el progreso del crucigrama:', error)
      } else {
        if (data.length > 0) {
          setPrevProgressId(data[0].id)
          const prevProgress = data[0].current_answers as string
          if (prevProgress !== null) {
            window.localStorage.setItem(storageKey, JSON.parse(prevProgress))
          }

          setIsCompleted(data[0]?.completed || false)

          if (data[0].time_spent === crosswordData?.time_limit) {
            setTimeExpired(true)
            setDisplayTimeSpent(0)
          } else {
            const fetchedTimeSpent = data[0].time_spent
              ? intervalToSeconds(data[0].time_spent)
              : 0
            setDisplayTimeSpent(fetchedTimeSpent)
            setDbUpdateTimeSpent(fetchedTimeSpent)
          }
        } else {
          // if user do not have previous progress, we create a new one with default values
          await supabase.from('user_progress').insert([
            {
              crossword_id: Number(crosswordId),
              profile_id: session?.user.id,
              time_spent: '00:00:00'
            }
          ])
          fetchLastProgress()
        }
      }

      setIsFetchingLastProgress(false)
    }

    fetchLastProgress()
  }, [crosswordId, session, storageKey, crosswordData, timeExpired])

  useEffect(() => {
    if (!session) return
    if (!crosswordId) return

    const fetchClues = () => {
      supabase
        .from('user_used_clues')
        .select('*')
        .eq('crossword_id', crosswordId)
        .eq('profile_id', session.user.id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error al cargar las pistas:', error)
          } else {
            setUsedClues(data)
          }
        })
    }

    fetchClues()
  }, [crosswordId, session, storageKey, timeExpired])

  // Actualizar `displayTimeSpent` cada segundo en la UI
  useEffect(() => {
    if (!timeLimit) return
    if (!prevProgressId) return

    const displayInterval = setInterval(() => {
      setDisplayTimeSpent((prevTime) => {
        const newTime = prevTime + 1
        if (newTime >= timeLimit) {
          clearInterval(displayInterval)
          setTimeExpired(true) // Muestra el diálogo de error

          supabase
            .from('user_progress')
            .update({
              time_spent: secondsToIntervalFormat(timeLimit)
            })
            .eq('id', prevProgressId)
            .then(() => {})

          setDbUpdateTimeSpent(timeLimit) // Actualiza el tiempo en la base de datos
          return timeLimit
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(displayInterval)
  }, [timeLimit, prevProgressId])

  // Actualizar `dbUpdateTimeSpent` cada 5 segundos y enviar a la base de datos
  useEffect(() => {
    if (!timeLimit) return
    const dbUpdateInterval = setInterval(() => {
      setDbUpdateTimeSpent((prevTime) => {
        const newTime = prevTime + 5
        if (newTime >= timeLimit) {
          clearInterval(dbUpdateInterval)
          return timeLimit
        }
        return newTime
      })
    }, 5000)

    return () => clearInterval(dbUpdateInterval)
  }, [timeLimit])

  // Función para iniciar el intervalo de actualización en la base de datos cada 5 segundos
  const updateDbTimeSpent = useCallback(async () => {
    if (timeExpired) return

    await supabase
      .from('user_progress')
      .update({
        time_spent: secondsToIntervalFormat(dbUpdateTimeSpent)
      })
      .eq('id', prevProgressId)
  }, [dbUpdateTimeSpent, prevProgressId, timeExpired])

  // Llama a `updateDbTimeSpent` cada vez que `dbUpdateTimeSpent` cambia, si el tiempo no ha expirado
  useEffect(() => {
    if (
      session &&
      prevProgressId &&
      timeLimit !== null &&
      dbUpdateTimeSpent < timeLimit
    ) {
      updateDbTimeSpent()
    }
  }, [dbUpdateTimeSpent, session, prevProgressId, timeLimit])

  const handleUpdateCrosswordProgress = useCallback(async () => {
    if (!session) return

    const data = window.localStorage.getItem(storageKey)

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

    if (updated !== null && updated?.length > 0) {
      window.localStorage.setItem(
        storageKey,
        JSON.parse(updated[0]?.current_answers as string)
      )
    }
  }, [session, storageKey, prevProgressId, crosswordId])

  const handleRestartLevel = async () => {
    if (!session) return
    if (!prevProgressId) return

    // Elimina el progreso actual del crucigrama
    await supabase.from('user_progress').delete().eq('id', prevProgressId)
    await supabase
      .from('user_used_clues')
      .delete()
      .eq('crossword_id', Number(crosswordId))
      .eq('profile_id', session.user.id)
    localStorage.removeItem(storageKey)

    // Reinicia el tiempo en la base de datos
    setDbUpdateTimeSpent(0)
    setDisplayTimeSpent(0)
    setIsCompleted(false)
    setTimeExpired(false)
    setUsedClues([])
  }

  const handleCrosswordCorrect = async () => {
    if (!prevProgressId) return

    if (isCompleted) return

    setIsCompleted(true)
    await supabase
      .from('user_progress')
      .update({ completed: true })
      .eq('id', prevProgressId)
  }

  const handleRevealClue = async () => {
    if (!session?.user.id) return
    if (!crosswordId) return

    const { data, error } = await supabase
      .from('user_used_clues')
      .insert([
        {
          crossword_id: Number(crosswordId),
          profile_id: session.user.id
        }
      ])
      .select()
      .single()

    if (error || !data) return

    setUsedClues((prevClues) => [...prevClues, data])
  }

  useEffect(() => {
    if (usedClues.length >= 3) {
      setNoCluesLeft(true)
    } else {
      setNoCluesLeft(false)
    }
  }, [usedClues])

  const debouncedUpdateProgress = useMemo(
    () => debounce(handleUpdateCrosswordProgress, 3000),
    [handleUpdateCrosswordProgress]
  )

  const handleCloseInstructions = () => {
    setShowInstructions(false)
    setInstructionsOpen(false)
  }

  const handleOpenInstructions = () => {
    setInstructionsOpen(true)
  }

  const isInstructionsDialogOpen = useMemo(
    () => showInstructions || instructionsOpen,
    [showInstructions, instructionsOpen]
  )

  if (loading || isFetchingLastProgress || !crosswordData || !crosswordId) {
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

  // Calcula el tiempo restante en segundos
  const timeRemaining =
    timeLimit !== null ? Math.max(0, timeLimit - displayTimeSpent) : 0

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
            <Typography variant='body2' color='error' gutterBottom>
              {timeExpired
                ? '¡Tiempo agotado!'
                : noCluesLeft
                ? '¡No hay pistas disponibles!'
                : `Tiempo restante: ${secondsToIntervalFormat(timeRemaining)}`}
            </Typography>
            <Stack
              width='100%'
              direction='row'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box flexDirection='row-reverse' display='flex'>
                {[...Array(3)].map((_, index) => {
                  const usedCluesCount = usedClues.length

                  if (usedCluesCount > index) {
                    return (
                      <i
                        key={index}
                        className='nes-icon is-large heart is-transparent'
                      />
                    )
                  }

                  return <i key={index} className='nes-icon is-large heart' />
                })}
              </Box>
              <Box>
                <button
                  className='nes-btn is-success'
                  onClick={handleRevealClue}
                >
                  Usar pista
                </button>
              </Box>
            </Stack>
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
                onCrosswordCorrect={handleCrosswordCorrect}
                key={storageKey}
                data={crosswordData.data as CluesInputOriginal}
                useStorage
                storageKey={storageKey}
                acrossLabel='Horizontal'
                downLabel='Vertical'
                onCellChange={debouncedUpdateProgress}
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

        <Dialog
          open={isInstructionsDialogOpen}
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

        <ErrorDialog
          open={showNotFoundRoute}
          onClose={() => navigate('/app/crosswords')}
          title='Error'
          message='No se encontró la ruta solicitada.'
        />

        {/* Diálogo de tiempo agotado */}
        <Dialog
          open={timeExpired && !noCluesLeft && !isCompleted}
          onClose={() =>
            navigate(
              `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
            )
          }
        >
          <DialogTitle>Tiempo Agotado</DialogTitle>
          <DialogContent>
            <Typography>
              El tiempo para completar el crucigrama ha expirado.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Stack direction='row' justifyContent='space-between' width='100%'>
              <button
                className='nes-btn is-secondary'
                onClick={() =>
                  navigate(
                    `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
                  )
                }
              >
                Aceptar
              </button>
              <button
                className='nes-btn is-primary'
                onClick={handleRestartLevel}
              >
                Reiniciar
              </button>
            </Stack>
          </DialogActions>
        </Dialog>

        <Dialog
          open={noCluesLeft && !isCompleted}
          onClose={() =>
            navigate(
              `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
            )
          }
        >
          <DialogTitle>Buen intento!</DialogTitle>
          <DialogContent>
            <Typography>
              Has agotado todas las pistas disponibles. ¡Buena suerte!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Stack direction='row' justifyContent='space-between' width='100%'>
              <button
                className='nes-btn is-secondary'
                onClick={() =>
                  navigate(
                    `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
                  )
                }
              >
                Aceptar
              </button>
              <button
                className='nes-btn is-primary'
                onClick={handleRestartLevel}
              >
                Reiniciar
              </button>
            </Stack>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isCompleted}
          onClose={() =>
            navigate(
              `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
            )
          }
        >
          <DialogTitle>Felicidades!</DialogTitle>
          <DialogContent>
            <Typography>Has completado el crucigrama. ¡Bien hecho!</Typography>
          </DialogContent>
          <DialogActions>
            <Stack direction='row' justifyContent='end' width='100%'>
              <button
                className='nes-btn is-primary'
                onClick={() =>
                  navigate(
                    `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
                  )
                }
              >
                Continuar
              </button>
            </Stack>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}
