import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  Stack,
  Snackbar,
  Alert
} from '@mui/material'
import { ErrorDialog } from '../components/ErrorDialog'
import { supabase } from '../services/supabase'
import Crossword, {
  CrosswordProviderImperative
} from '@jaredreisinger/react-crossword'
import useLocalStorage from '../hooks/useLocalStorage'
import useSession from '../hooks/useSession'
import { theme } from '../components/Theme'
import { Database } from '../types/db.types'
import { CluesInputOriginal } from '@jaredreisinger/react-crossword/dist/types'
import { Check } from '@mui/icons-material'

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

  const [validGuesses, setValidGuesses] = useState<boolean>(false)

  const [userProgress, setUserProgress] =
    useState<Database['public']['Tables']['user_progress']['Row']>()
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
  const [failed, setFailed] = useState(false) // Estado para controlar el diálogo de tiempo agotado
  const crosswordRef = useRef<CrosswordProviderImperative>(null)
  const solvedCrosswordRef = useRef<CrosswordProviderImperative>(null)

  const [isSavingProgress, setIsSavingProgress] = useState(false)

  const storageKey = useMemo(
    () => `crossword-${crosswordId}-${session?.user.id}`,
    [crosswordId, session?.user]
  )

  const solvedStorageKey = useMemo(
    () => `solved-crossword-${crosswordId}-${session?.user.id}`,
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

  const fetchLastProgress = useCallback(async () => {
    if (!session) return

    setIsFetchingLastProgress(true)
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('crossword_id', Number(crosswordId))
      .eq('profile_id', session?.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error al cargar el progreso del crucigrama:', error)
    } else {
      if (data !== null) {
        crosswordRef.current?.reset()
        localStorage.removeItem(storageKey)

        setUserProgress(data)
        setPrevProgressId(data.id)
        const prevProgress = data.current_answers as string

        const parsedProgress = JSON.parse(prevProgress)

        if (!parsedProgress?.guesses && prevProgress !== null) {
          setValidGuesses(false)
          setIsFetchingLastProgress(false)
          return
        }

        if (parsedProgress?.guesses) {
          localStorage.setItem(storageKey, JSON.stringify(parsedProgress))
        }

        setIsCompleted(data?.completed || false)
        setFailed(data?.failed || false)

        if (data.time_spent === crosswordData?.time_limit) {
          setTimeExpired(true)
          setDisplayTimeSpent(0)
        } else {
          const fetchedTimeSpent = data.time_spent
            ? intervalToSeconds(data.time_spent as string)
            : 0
          setDisplayTimeSpent(fetchedTimeSpent)
          setDbUpdateTimeSpent(fetchedTimeSpent)
        }

        setValidGuesses(true)
      } else {
        // if user do not have previous progress, we create a new one with default values
        await supabase.from('user_progress').insert([
          {
            crossword_id: Number(crosswordId),
            profile_id: session?.user.id,
            time_spent: '00:00:00',
            failed: false,
            completed: false
          }
        ])
        fetchLastProgress()
      }
    }

    setIsFetchingLastProgress(false)
  }, [crosswordId, session, storageKey, crosswordData])

  useEffect(() => {
    if (!session) return
    if (!crosswordData) return

    fetchLastProgress()
  }, [
    crosswordId,
    session,
    storageKey,
    crosswordData,
    timeExpired,
    fetchLastProgress
  ])

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

    if (userProgress?.failed) return

    setIsSavingProgress(true)

    const displayInterval = setInterval(() => {
      setDisplayTimeSpent((prevTime) => {
        const newTime = prevTime + 1
        if (newTime >= timeLimit) {
          clearInterval(displayInterval)
          setTimeExpired(true) // Muestra el diálogo de error

          supabase
            .from('user_progress')
            .update({
              time_spent: secondsToIntervalFormat(timeLimit),
              failed: true,
              completed: false
            })
            .eq('id', prevProgressId)
            .then(() => {
              setIsSavingProgress(false)
              console.log('successssss')
            })

          setDbUpdateTimeSpent(timeLimit)
          return timeLimit
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(displayInterval)
  }, [timeLimit, prevProgressId, userProgress])

  // Actualizar `dbUpdateTimeSpent` cada 5 segundos y enviar a la base de datos
  useEffect(() => {
    if (!timeLimit) return

    if (userProgress?.failed || userProgress?.completed) return

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
  }, [timeLimit, userProgress])

  // Función para iniciar el intervalo de actualización en la base de datos cada 5 segundos
  const updateDbTimeSpent = useCallback(async () => {
    if (timeExpired) return
    if (prevProgressId === undefined) return
    setIsSavingProgress(true)

    await supabase
      .from('user_progress')
      .update({
        time_spent: secondsToIntervalFormat(dbUpdateTimeSpent)
      })
      .eq('id', prevProgressId)

    setIsSavingProgress(false)
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

    const data = localStorage.getItem(storageKey)
    setIsSavingProgress(true)

    const { data: updated } = await supabase
      .from('user_progress')
      .upsert(
        {
          id: prevProgressId ?? undefined,
          crossword_id: Number(crosswordId),
          profile_id: session?.user.id,
          current_answers: data
        },
        {
          onConflict: 'id'
        }
      )
      .select()

    setIsSavingProgress(false)

    if (updated !== null && updated?.length > 0) {
      const currentAnswers = JSON.parse(updated[0]?.current_answers as string)

      if (!currentAnswers?.guesses) return

      localStorage.setItem(storageKey, updated[0]?.current_answers as string)
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

    // Reinicia el tiempo en la base de datos
    setDbUpdateTimeSpent(0)
    setDisplayTimeSpent(0)
    setIsCompleted(false)
    setTimeExpired(false)
    setFailed(false)
    setUsedClues([])

    fetchLastProgress()
  }

  const handleCrosswordCorrect = async () => {
    if (!prevProgressId) return
    if (isCompleted) return

    const isCorrect = crosswordRef.current?.isCrosswordCorrect()

    if (!isCorrect) return

    setIsCompleted(true)
    await supabase
      .from('user_progress')
      .update({ completed: true, failed: false })
      .eq('id', prevProgressId)

    localStorage.removeItem(storageKey)
  }

  const handleRevealClue = async () => {
    if (!session?.user.id) return
    if (!crosswordId) return

    solvedCrosswordRef.current?.fillAllAnswers()

    const solvedData = JSON.parse(
      localStorage.getItem(solvedStorageKey) as string
    )

    const currentProgress = JSON.parse(
      localStorage.getItem(storageKey) as string
    )

    const targetCellsKeys = Object.keys(solvedData?.guesses)

    const discrepanciesKeys = targetCellsKeys.filter(
      (cell) => currentProgress?.guesses[cell] !== solvedData?.guesses[cell]
    )

    const randomDiscrepancyIndex = Math.random() * discrepanciesKeys.length

    const randomDiscrepancyKey =
      discrepanciesKeys[Math.floor(randomDiscrepancyIndex)]

    const randomDiscrepancyValue = solvedData.guesses[randomDiscrepancyKey]

    const [col, _, row] = randomDiscrepancyKey

    crosswordRef.current?.setGuess(
      Number(col),
      Number(row),
      randomDiscrepancyValue
    )

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

  solvedCrosswordRef?.current?.fillAllAnswers()

  return (
    <Container
      className='nes-container is-dark !mx-auto max-w-[96%] !mb-20'
      component='main'
    >
      <Box
        display='flex'
        alignItems='center'
        sx={{
          opacity: '0.7'
        }}
        gap={1}
        fontSize={12}
      >
        {isSavingProgress ? (
          <>
            Guardando progreso...
            <CircularProgress color='success' size={22} />
          </>
        ) : (
          <>
            Progreso guardado
            <Check color='success' />
          </>
        )}
      </Box>
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
                : `Tiempo restante: ${secondsToIntervalFormat(timeRemaining)}`}
            </Typography>
            <Stack
              width='100%'
              direction='row'
              alignItems='center'
              justifyContent='space-between'
            >
              <button
                className='nes-btn is-primary'
                onClick={handleRestartLevel}
              >
                Reiniciar
              </button>

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
                  className={`nes-btn ${
                    noCluesLeft ? 'is-disabled' : 'is-success'
                  }`}
                  disabled={noCluesLeft}
                  onClick={handleRevealClue}
                >
                  {noCluesLeft ? 'No hay pistas' : 'Usar pista'}
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
              {validGuesses ? (
                <>
                  <Crossword
                    onCrosswordCorrect={handleCrosswordCorrect}
                    key={storageKey}
                    data={crosswordData.data as CluesInputOriginal}
                    useStorage
                    storageKey={storageKey}
                    ref={crosswordRef}
                    acrossLabel='Horizontal'
                    downLabel='Vertical'
                    onCellChange={debouncedUpdateProgress}
                    theme={{
                      highlightBackground: 'orange'
                    }}
                  />
                  <div className='-z-10 invisble pointer-events-none absolute opacity-0'>
                    <Crossword
                      key={solvedStorageKey}
                      data={crosswordData.data as CluesInputOriginal}
                      useStorage
                      storageKey={solvedStorageKey}
                      ref={solvedCrosswordRef}
                    />
                  </div>
                </>
              ) : null}
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

        {/* Diálogo de tiempo agotado */}
        <Dialog
          open={failed}
          onClose={() =>
            navigate(
              `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
            )
          }
        >
          <DialogTitle>
            ¡Oh no! Has fallado en completar el crucigrama.
          </DialogTitle>
          <DialogContent>
            <Typography>
              Has fallado en completar el crucigrama antes de que se agote el
              tiempo.
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
      </Box>
    </Container>
  )
}
