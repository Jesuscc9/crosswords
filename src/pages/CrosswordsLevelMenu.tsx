import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { theme } from '../components/Theme'
import useSession from '../hooks/useSession'
import { getCrosswords } from '../services/getCrosswords'
import { Database } from '../types/db.types'
import { getUserProgress } from '../services/getUserProgress'

type Difficulty = Database['public']['Enums']['crossword_difficulty']
type Topic = Database['public']['Enums']['crossword_topic']

const LEVELS_LABELS = {
  EASY: 'Fácil',
  MEDIUM: 'Medio',
  HARD: 'Difícil'
}

const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']

type iCrossword = Database['public']['Tables']['crosswords']['Row']

const CrosswordsLevelsMenu: React.FC = () => {
  const { crosswordTopic, crosswordDifficulty } = useParams()
  const { session } = useSession()

  const [levels, setLevels] = useState<iCrossword[]>([])
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [showLockedDialog, setShowLockedDialog] = useState(false)
  const currentDifficulty = crosswordDifficulty?.toUpperCase() as Difficulty

  const [progressByCrossword, setProgressByCrossword] = useState({})

  const [usedCluesByCrossword, setUsedCluesByCrossword] = useState({})
  const [tutorialCompleted, setTutorialCompleted] = useState(false)
  const navigate = useNavigate()

  const [isFetchingLevels, setIsFetchingLevels] = useState(false)
  const [isFetchingTutorial, setIsFetchingTutorial] = useState(false)

  useEffect(() => {
    if (!session) return
    if (!crosswordTopic) return
    if (!currentDifficulty) return

    setIsFetchingLevels(true)

    const fetchCrosswordsByTopicAndDifficulty = async () => {
      const { data, error } = await getCrosswords({
        difficulty: currentDifficulty,
        topic: crosswordTopic as Topic
      })

      if (error) console.error('Error fetching levels:', error)
      else {
        setLevels(data)
        setIsFetchingLevels(false)
      }
    }

    const checkIfTutorialCompleted = async () => {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('difficulty', currentDifficulty.toUpperCase())
        .eq('topic', crosswordTopic?.toUpperCase())
        .eq('profile_id', session?.user.id)
        .limit(1)

      if (error) console.error('Error fetching tutorial:', error)
      else {
        setTutorialCompleted(data.length > 0)
        setIsFetchingTutorial(false)
      }
    }

    fetchCrosswordsByTopicAndDifficulty()
    checkIfTutorialCompleted()
  }, [currentDifficulty, crosswordTopic, session])

  useEffect(() => {
    if (!session) return

    const fetchProgress = async () => {
      const { data, error } = await getUserProgress(session.user.id)

      setProgressByCrossword(
        Object.groupBy(data, ({ crossword_id }) => crossword_id)
      )
    }

    const fetchUsedClues = async () => {
      const { data, error } = await supabase
        .from('user_used_clues')
        .select('*')
        .eq('profile_id', session.user.id)

      setUsedCluesByCrossword(
        Object.groupBy(data, ({ crossword_id }) => crossword_id)
      )
    }

    fetchUsedClues()
    fetchProgress()
  }, [session])

  const handleLevelClick = (crosswordId?: number) => {
    if (!crosswordId) {
      navigate('tutorial')
      return
    }

    if (!tutorialCompleted) {
      setShowLockedDialog(true)
      return
    }

    navigate(`${crosswordId}`)
  }

  const changeDifficulty = (direction: 'prev' | 'next') => {
    const currentIndex = difficulties.indexOf(currentDifficulty)
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < difficulties.length) {
      navigate(
        `/app/crosswords/${crosswordTopic}/${difficulties[
          newIndex
        ].toLowerCase()}/levels`
      )
    }
  }

  return (
    <>
      <Box
        className='nes-container !px-4 md:!px-16 !py-8 is-rounded !mt-10 w-[1200px] !mx-auto max-w-[96%]'
        mb={20}
        sx={{ textAlign: 'center', backgroundColor: '#f8e6d4' }}
      >
        <Typography variant='h4' className='nes-text' gutterBottom>
          Crucigramas de {crosswordTopic?.toUpperCase()}
        </Typography>

        <Typography variant='h6' className='nes-text is-error' sx={{ my: 3 }}>
          Nivel: {LEVELS_LABELS[currentDifficulty]}
        </Typography>

        <Box
          display='grid'
          gap={2}
          sx={{
            mt: 3,
            gridTemplateColumns: 'repeat(5, 1fr)',
            [theme.breakpoints.down('md')]: {
              gridTemplateColumns: 'repeat(1, 1fr)'
            }
          }}
        >
          <Box
            className='nes-btn is-primary'
            sx={{
              padding: 2,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              height: '100%'
            }}
            onClick={() => handleLevelClick()}
          >
            <Typography variant='h6' color='white'>
              Tutorial
            </Typography>
            <Box display='flex'>
              <i
                className={`nes-icon trophy ${
                  !tutorialCompleted && 'is-empty'
                }`}
                style={{ fontSize: '1.5rem', color: '#FFD700' }}
              />
            </Box>
          </Box>

          {levels.map((level, index) => {
            const isUnlocked = true

            const isInProgress = progressByCrossword[level.id] !== undefined

            const isFailed = progressByCrossword[level.id]?.[0].failed

            const isCompleted =
              completedLevels.includes(level.id) ||
              progressByCrossword[level.id]?.[0].failed

            return (
              <Box
                key={level.id}
                className={`nes-btn is-primary ${
                  !tutorialCompleted && 'is-disabled'
                }`}
                onClick={() => handleLevelClick(level.id)}
                sx={{
                  padding: 2,
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: isUnlocked ? 'pointer' : 'default',
                  height: '100%',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant='h6' color='white' gutterBottom>
                  {index + 1}
                </Typography>
                {isInProgress && !isCompleted && (
                  <Box display='flex' flexDirection='row'>
                    <div className='whitespace-nowrap !text-xs text-left opacity-50'>
                      En progreso
                    </div>
                  </Box>
                )}
                {isFailed && (
                  <Box display='flex' flexDirection='row'>
                    <div className='whitespace-nowrap !text-xs text-left opacity-50'>
                      Tiempo agotado
                    </div>
                  </Box>
                )}

                <Box display='flex' flexDirection='row'>
                  {[...Array(3)].map((_, starIndex) => {
                    const isCompleted =
                      completedLevels.includes(level.id) ||
                      progressByCrossword[level.id]?.[0].failed

                    const cluesUsed = progressByCrossword[level.id]?.[0].failed
                      ? 3
                      : usedCluesByCrossword[level.id]?.length

                    const score = 3 - cluesUsed

                    const starIsFilled = starIndex < score
                    return (
                      <i
                        key={starIndex}
                        className={`nes-icon star ${
                          (!starIsFilled || !isCompleted) && 'is-empty'
                        }`}
                        style={{
                          fontSize: '1.5rem',
                          color: isCompleted ? '#FFD700' : '#CCCCCC'
                        }}
                      />
                    )
                  })}
                </Box>
              </Box>
            )
          })}
        </Box>

        {/* Dialog to show when a level is locked */}
        <Dialog
          open={showLockedDialog}
          onClose={() => setShowLockedDialog(false)}
        >
          <DialogContent>
            <Typography variant='body1'>
              Este nivel está bloqueado. Completa el tutorial para
              desbloquearlo.
            </Typography>
          </DialogContent>
          <DialogActions>
            <button
              className='nes-btn'
              onClick={() => setShowLockedDialog(false)}
              autoFocus
            >
              Entendido
            </button>
          </DialogActions>
        </Dialog>

        {/* Difficulty Change Buttons */}
        <Box display='flex' justifyContent='space-between' sx={{ mt: 4 }}>
          <button
            className={`nes-btn is-warning ${
              difficulties.indexOf(currentDifficulty) === 0 ? 'is-disabled' : ''
            }`}
            onClick={() => changeDifficulty('prev')}
            disabled={difficulties.indexOf(currentDifficulty) === 0}
          >
            Nivel Anterior
          </button>
          <button
            className={`nes-btn is-success ${
              difficulties.indexOf(currentDifficulty) === 2 ? 'is-disabled' : ''
            }`}
            onClick={() => changeDifficulty('next')}
            disabled={
              difficulties.indexOf(currentDifficulty) ===
              difficulties.length - 1
            }
          >
            Siguiente Nivel
          </button>
        </Box>

        {/* Button to go back to main menu */}
      </Box>
      <Box display='flex' justifyContent='center' sx={{ mt: 4 }}>
        <button
          className='nes-btn is-primary'
          onClick={() => navigate('/app/crosswords')}
        >
          Volver al Inicio
        </button>
      </Box>
    </>
  )
}

export default CrosswordsLevelsMenu
