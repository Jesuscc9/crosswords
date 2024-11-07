import React from 'react'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab'
import { Typography, Box, Button } from '@mui/material'
import { supabase } from '../services/supabase'
import { useNavigate, useParams } from 'react-router-dom'
import useSession from '../hooks/useSession'
import { timelineItemClasses } from '@mui/lab/TimelineItem'
import { theme } from '../components/Theme'

export default function LearningTopicPage() {
  const navigate = useNavigate()
  const { session } = useSession()

  const { crosswordDifficulty, crosswordTopic } = useParams()

  const handleComplete = async () => {
    if (!session) return
    // Registro del progreso en Supabase
    const { error } = await supabase.from('learning_progress').insert([
      {
        topic: crosswordTopic?.toUpperCase(),
        difficulty: crosswordDifficulty?.toUpperCase(),
        profile_id: session.user.id
      }
    ])

    if (!error) {
      navigate(
        `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
      ) // Cambia '/next-page' a la ruta deseada
    } else {
      console.error('Error registrando el progreso:', error)
    }
  }

  return (
    <div className='nes-container is-rounded is-dark !w-[1500px] max-w-[96%] !p-8 !mx-auto !mb-20'>
      <Typography
        className='nes-text is-error'
        variant='h4'
        align='center'
        gutterBottom
      >
        Aprendizaje de Scrum
      </Typography>
      <br />
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0
          },
          [theme.breakpoints.down('md')]: {
            width: '100%'
          },
          width: '80%'
        }}
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent
            sx={{
              mb: 10
            }}
          >
            <Typography
              variant='h5'
              component='span'
              className='nes-text is-primary'
            >
              ¿Qué es Scrum?
            </Typography>
            <br />
            <br />
            <Typography>
              Scrum es una metodología ágil de trabajo colaborativo que permite
              la organización y desarrollo de proyectos de manera iterativa e
              incremental, enfocándose en la eficiencia y la adaptabilidad.
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent
            sx={{
              mb: 10
            }}
          >
            <Typography variant='h6' component='span'>
              Video Explicativo
            </Typography>
            <Box
              sx={{
                mt: 2,
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0
              }}
            >
              <iframe
                width='100%'
                height='100%'
                src='https://www.youtube.com/embed/sLexw-z13Fo'
                title='SCRUM Introduction'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              ></iframe>
            </Box>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color='primary' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent
            sx={{
              mb: 0
            }}
          >
            <Typography variant='h6' component='span'>
              ¿Qué es Scrum?
            </Typography>
            <Typography>
              Scrum es una metodología ágil de trabajo colaborativo que permite
              la organización y desarrollo de proyectos de manera iterativa e
              incremental, enfocándose en la eficiencia y la adaptabilidad.
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>

      {/* Botón para registrar el progreso */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <button className='nes-btn is-warning !p-4' onClick={handleComplete}>
          Estoy listo!
        </button>
      </Box>
    </div>
  )
}
