import React, { useEffect } from 'react'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab'
import { Typography, Box, Stack } from '@mui/material'
import { supabase } from '../services/supabase'
import { useNavigate, useParams } from 'react-router-dom'
import useSession from '../hooks/useSession'
import { timelineItemClasses } from '@mui/lab/TimelineItem'
import { theme } from '../components/Theme'
import { learningData } from '../utils/learningData'

// Tipos de dificultad y tema específicos para Supabase
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
type Topic = 'SCRUM' | 'PMBOK'

// Definimos el tipo para el registro de progreso
type LearningProgress = {
  created_at?: string
  difficulty: Difficulty
  profile_id: string
  topic: Topic
}

export default function LearningTopicPage() {
  const navigate = useNavigate()
  const { session } = useSession()

  const { crosswordDifficulty, crosswordTopic } = useParams<{
    crosswordDifficulty?: string
    crosswordTopic?: string
  }>()

  const [currentStep, setCurrentStep] = React.useState(0)
  const [stepRevealChar, setStepRevealChar] = React.useState(0)
  const intervalIdRef = React.useRef<number>(null)

  const handleComplete = async () => {
    if (!session || !crosswordTopic || !crosswordDifficulty) return

    // Convertimos `crosswordDifficulty` y `crosswordTopic` a tipos compatibles
    const difficulty = crosswordDifficulty.toUpperCase() as Difficulty
    const topic = crosswordTopic.toUpperCase() as Topic

    const { error } = await supabase
      .from('learning_progress')
      .insert<LearningProgress>([
        {
          topic,
          difficulty,
          profile_id: session.user.id
        }
      ])

    if (!error) {
      navigate(
        `/app/crosswords/${crosswordTopic}/${crosswordDifficulty}/levels`
      )
    } else {
      console.error('Error registrando el progreso:', error)
    }
  }

  const handleNext = () => {
    if (currentStep < learningData[crosswordTopic.toUpperCase()].length - 1) {
      setCurrentStep((prev) => prev + 1)
      setStepRevealChar(0)
    }
  }

  useEffect(() => {
    if (!learningData[crosswordTopic.toUpperCase()][currentStep]?.content)
      return

    clearInterval(intervalIdRef?.current ?? 0)

    intervalIdRef.current = setInterval(() => {
      setStepRevealChar((prev) => prev + 1)
      if (
        stepRevealChar >=
        learningData[crosswordTopic.toUpperCase()][currentStep].content.length
      ) {
        clearInterval(intervalIdRef.current)
      }
    }, 33)
  }, [currentStep])

  const currentStepIsLast =
    currentStep === learningData?.[crosswordTopic.toUpperCase()]?.length - 1

  if (!crosswordTopic) return <div>Ruta no valida!</div>

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
        {learningData[crosswordTopic.toUpperCase()]
          .filter((_, i) => i === currentStep)
          .map((item, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color={item.dotColor} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent
                sx={{
                  mb:
                    index !==
                    learningData[crosswordTopic.toUpperCase()].length - 1
                      ? 4
                      : 0
                }}
              >
                <Typography variant='h6' component='span'>
                  {item.title}
                </Typography>
                <Stack direction='row' mt={4}>
                  {item.content && (
                    <>
                      <br />
                      <section className='message-list'>
                        <section className='message -left flex flex-col-reverse'>
                          <div className='w-[144px] h-[144px]'>
                            <i className='nes-kirby transform origin-top-left scale-150'></i>
                          </div>
                          <div className='nes-balloon from-left'>
                            <p className='text-black'>
                              {item.content.slice(0, stepRevealChar)}
                            </p>
                          </div>
                        </section>
                      </section>
                    </>
                  )}
                </Stack>
                {item.video && (
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
                      src={item.video}
                      title={item.title}
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
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
      </Timeline>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        {currentStepIsLast ? (
          <button className='nes-btn is-warning !p-4' onClick={handleComplete}>
            Estoy listo!
          </button>
        ) : (
          <button className='nes-btn is-warning !p-4' onClick={handleNext}>
            Continuar
          </button>
        )}
      </Box>
    </div>
  )
}
