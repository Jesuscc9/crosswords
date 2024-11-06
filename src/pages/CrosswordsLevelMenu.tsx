import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
type Topic = 'SCRUM' | 'PMBOK'

const LEVELS_LABELS = {
  EASY: 'Fácil',
  MEDIUM: 'Medio',
  HARD: 'Difícil'
}

interface CrosswordsLevelsProps {
  difficulty: Difficulty // EASY, MEDIUM, HARD
  topic: Topic // SCRUM, PMBOK
}

const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']

const CrosswordsLevelsMenu: React.FC<CrosswordsLevelsProps> = ({
  difficulty,
  topic
}) => {
  const [levels, setLevels] = useState<number[]>([])
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [showLockedDialog, setShowLockedDialog] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLevels = async () => {
      const { data, error } = await supabase
        .from('crosswords')
        .select('*')
        .eq('difficulty', currentDifficulty)
        .eq('topic', topic)

      if (error) console.error('Error fetching levels:', error)
      else {
        setLevels(data.map((level: any) => level.id))
        setCompletedLevels(
          data
            .filter((level: any) => level.is_completed)
            .map((level: any) => level.id)
        )
      }
    }

    fetchLevels()
  }, [currentDifficulty, topic])

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

  const handleLevelClick = (crosswordId: number) => {
    navigate(`/${crosswordId}`)
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
        className='nes-container is-rounded !mt-10 w-[1200px] !mx-auto max-w-full'
        sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f8e6d4' }}
      >
        <Typography variant='h4' className='nes-text is-primary' gutterBottom>
          Crucigramas de {topic}
        </Typography>

        <Typography variant='h6' className='nes-text is-warning' sx={{ my: 3 }}>
          Nivel: {LEVELS_LABELS[currentDifficulty]}
        </Typography>

        <Box
          display='grid'
          gridTemplateColumns='repeat(5, 1fr)'
          gap={2}
          sx={{ mt: 3 }}
        >
          {/* Tutorial Level */}
          <Box
            className='nes-btn is-primary'
            onClick={() => handleLevelClick(0)}
            sx={{
              padding: 2,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <Typography variant='h6' color='textPrimary'>
              Tutorial
            </Typography>
            <Box display='flex'>
              <i
                className='nes-icon trophy'
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
                key={level}
                className={`nes-btn ${
                  isUnlocked ? 'is-primary' : 'is-disabled'
                }`}
                onClick={() => handleLevelClick(level)}
                sx={{
                  padding: 2,
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: isUnlocked ? 'pointer' : 'default'
                }}
              >
                <Typography variant='h6' color='textPrimary'>
                  {level}
                </Typography>
                <Box display='flex'>
                  {[...Array(3)].map((_, starIndex) => (
                    <i
                      key={starIndex}
                      className={`nes-icon ${
                        isCompleted && starIndex < 3 ? 'is-star' : 'is-empty'
                      }`}
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
              Este nivel está bloqueado. Completa el nivel anterior para
              desbloquearlo.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowLockedDialog(false)}
              color='primary'
              autoFocus
            >
              Entendido
            </Button>
          </DialogActions>
        </Dialog>

        {/* Difficulty Change Buttons */}
        <Box display='flex' justifyContent='space-between' sx={{ mt: 4 }}>
          <Button
            variant='contained'
            color='secondary'
            className='nes-btn is-warning'
            onClick={() => changeDifficulty('prev')}
            sx={{
              fontWeight: 'bold',
              borderRadius: 5,
              padding: '0.5rem 1.5rem'
            }}
            disabled={difficulties.indexOf(currentDifficulty) === 0}
          >
            Nivel Anterior
          </Button>
          <Button
            variant='contained'
            color='primary'
            className='nes-btn is-success'
            onClick={() => changeDifficulty('next')}
            sx={{
              fontWeight: 'bold',
              borderRadius: 5,
              padding: '0.5rem 1.5rem'
            }}
            disabled={
              difficulties.indexOf(currentDifficulty) ===
              difficulties.length - 1
            }
          >
            Siguiente Nivel
          </Button>
        </Box>

        {/* Button to go back to main menu */}
      </Box>
      <Box display='flex' justifyContent='center' sx={{ mt: 4 }}>
        <Button
          variant='contained'
          color='info'
          className='nes-btn is-primary'
          onClick={() => navigate('/app/crosswords')}
          sx={{
            fontWeight: 'bold',
            borderRadius: 5,
            padding: '0.5rem 2rem'
          }}
        >
          Volver al Inicio
        </Button>
      </Box>
    </>
  )
}

export default CrosswordsLevelsMenu
