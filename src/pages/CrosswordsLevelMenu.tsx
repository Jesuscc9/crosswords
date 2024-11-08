import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { theme } from '../components/Theme'
import useSession from '../hooks/useSession'

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
type Topic = 'SCRUM' | 'PMBOK'

const LEVELS_LABELS = {
  EASY: 'Fácil',
  MEDIUM: 'Medio',
  HARD: 'Difícil'
}

const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']

const CrosswordsLevelsMenu: React.FC = () => {
  const { crosswordTopic, crosswordDifficulty } = useParams()
  const { session } = useSession()

  const [levels, setLevels] = useState<number[]>([])
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [showLockedDialog, setShowLockedDialog] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState(
    crosswordDifficulty?.toUpperCase() as Difficulty
  )
  const [tutorialCompleted, setTutorialCompleted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!session) return

    const fetchLevels = async () => {
      const { data, error } = await supabase
        .from('crosswords')
        .select('*')
        .eq('difficulty', currentDifficulty.toUpperCase())
        .eq('topic', crosswordTopic?.toUpperCase())

      if (error) console.error('Error fetching levels:', error)
      else {
        setLevels(data)
        setCompletedLevels(
          data
            .filter((level: any) => level.is_completed)
            .map((level: any) => level.id)
        )
      }
    }

    const fetchTutorial = async () => {
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
      }
    }

    fetchLevels()
    fetchTutorial()
  }, [currentDifficulty, crosswordTopic, session])

  // const handleLevelClick = (level: number) => {
  //   if (
  //     level === 0 ||
  //     completedLevels.includes(level) ||
  //     completedLevels.includes(level - 1)
  //   ) {
  //     navigate(`/crossword/${topic}/${currentDifficulty}/${level}`)
  //   } else {
  //     setShowLockedDialog(true)
  //   }
  // }

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
      setCurrentDifficulty(difficulties[newIndex])
    }
  }

  return (
    <>
      <Box
        className='nes-container !px-4 md:!px-16 !py-8 is-rounded !mt-10 w-[1200px] !mx-auto max-w-[96%]'
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
              height: '120px'
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
            // const isCompleted = completedLevels.includes(level)
            // const isUnlocked =
            //   index === 0 || completedLevels.includes(level - 1)

            const isCompleted = false
            const isUnlocked = true

            return (
              <Box
                key={level.id}
                className={`nes-btn is-primary ${
                  !tutorialCompleted && 'is-disabled'
                }`}
                onClick={() => handleLevelClick(level?.id)}
                sx={{
                  padding: 2,
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: isUnlocked ? 'pointer' : 'default',
                  height: '120px',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant='h6' color='white' gutterBottom>
                  {index + 1}
                </Typography>
                <Box display='flex'>
                  {[...Array(3)].map((_, starIndex) => (
                    <i
                      key={starIndex}
                      className='nes-icon is-empty star'
                      style={{
                        fontSize: '1.5rem',
                        color: isCompleted ? '#FFD700' : '#CCCCCC'
                      }}
                    />
                  ))}
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
              difficulties.indexOf(currentDifficulty) === -1
                ? 'is-disabled'
                : ''
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
