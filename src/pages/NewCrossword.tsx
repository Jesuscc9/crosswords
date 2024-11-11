import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Container,
  Alert,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton
} from '@mui/material'
import Button from '@mui/lab/LoadingButton'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { supabase } from '../services/supabase'
import Crossword, {
  CrosswordProviderImperative
} from '@jaredreisinger/react-crossword'
import { Add, Remove } from '@mui/icons-material'
import { iDifficulty, iTopic } from '../types/crosswords'

// Tipos para las pistas y datos del crucigrama
interface Clue {
  clue: string
  answer: string
  row: number
  col: number
}

interface CrosswordData {
  across: Record<number, Clue>
  down: Record<number, Clue>
}

// Tipos para los valores del formulario
interface FormValues {
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  time_limit: string
  topic: 'SCRUM' | 'PMBOK'
}

export const NewCrossword: React.FC = () => {
  const navigate = useNavigate()
  const crosswordRef = React.useRef<CrosswordProviderImperative>(null)

  // Estado para almacenar las pistas horizontales y verticales
  const [acrossClues, setAcrossClues] = useState<Clue[]>([
    { clue: '', answer: '', row: 0, col: 0 }
  ])
  const [downClues, setDownClues] = useState<Clue[]>([
    { clue: '', answer: '', row: 0, col: 0 }
  ])

  const storageKey = useMemo(() => `crossword-form-${Date.now()}`, [])

  // Estado para control de diálogo y envío
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)

  // Validación con Yup
  const validationSchema = Yup.object({
    title: Yup.string().required('El título es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    difficulty: Yup.string()
      .oneOf(['easy', 'medium', 'hard'], 'Selecciona una dificultad válida')
      .required('La dificultad es requerida'),
    time_limit: Yup.string()
      .matches(/^\d{2}:\d{2}:\d{2}$/, 'Formato de tiempo inválido (HH:MM:SS)')
      .required('El tiempo límite es requerido'),
    topic: Yup.string()
      .oneOf(['SCRUM', 'PMBOK'], 'Selecciona un tema válido')
      .required('El tema es requerido')
  })

  // Formik Hook
  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      time_limit: '00:00:00',
      topic: 'SCRUM'
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      setTimeout(() => {
        console.log(crosswordRef)
        crosswordRef.current?.fillAllAnswers()
      }, 33)

      setPreviewOpen(true) // Abre el diálogo de previsualización en lugar de enviar directamente
    }
  })

  // Maneja el envío definitivo al confirmar en el diálogo
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)
    const { title, description, difficulty, time_limit, topic } = formik.values

    // Formatear las pistas en el formato adecuado para el componente Crossword
    const formattedData: CrosswordData = {
      across: Object.fromEntries(
        acrossClues.map((clue, index) => [
          index + 1,
          {
            clue: clue.clue,
            answer: clue.answer.toUpperCase(),
            row: clue.row,
            col: clue.col
          }
        ])
      ),
      down: Object.fromEntries(
        downClues.map((clue, index) => [
          index + 1,
          {
            clue: clue.clue,
            answer: clue.answer.toUpperCase(),
            row: clue.row,
            col: clue.col
          }
        ])
      )
    }

    try {
      const { error } = await supabase.from('crosswords').insert([
        {
          title,
          description,
          difficulty: difficulty.toUpperCase() as iDifficulty,
          time_limit,
          topic: topic.toUpperCase() as iTopic,
          data: formattedData as { [key: string]: string },
          filled_crossword: window.localStorage.getItem(storageKey)
        }
      ])

      if (error) {
        setGeneralError(error.message)
      } else {
        setGeneralError(null)
        navigate('/app/crosswords', { replace: true })
      }
    } catch (error) {
      console.error(error)
      setGeneralError('Error inesperado')
    }

    setIsSubmitting(false)
    setPreviewOpen(false) // Cierra el diálogo después de enviar
  }

  const handleAddClue = (type: 'across' | 'down') => {
    const newClue: Clue = { clue: '', answer: '', row: 0, col: 0 }

    if (type === 'across') {
      setAcrossClues([...acrossClues, newClue])
    } else {
      setDownClues([...downClues, newClue])
    }
  }

  const handleRemoveClue = (type: 'across' | 'down', index: number) => {
    if (type === 'across') {
      setAcrossClues(acrossClues.filter((_, i) => i !== index))
    } else {
      setDownClues(downClues.filter((_, i) => i !== index))
    }
  }

  const handleClueChange = (
    type: 'across' | 'down',
    index: number,
    field: keyof Clue,
    value: string
  ) => {
    const updateClues = (clues: Clue[]) =>
      clues.map((clue, i) =>
        i === index
          ? {
              ...clue,
              [field]:
                field === 'row' || field === 'col' ? parseInt(value, 10) : value
            }
          : clue
      )

    if (type === 'across') {
      setAcrossClues(updateClues(acrossClues))
    } else {
      setDownClues(updateClues(downClues))
    }
  }

  return (
    <Container
      component='main'
      className='nes-container is-white bg-white max-w-[96%] mb-20'
    >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component='h1' variant='h5'>
          Crear Crucigrama
        </Typography>

        <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            id='title'
            label='Título'
            name='title'
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            margin='normal'
            variant='outlined'
          />

          <TextField
            fullWidth
            id='description'
            label='Descripción'
            name='description'
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            margin='normal'
            variant='outlined'
          />

          <TextField
            select
            fullWidth
            id='difficulty'
            label='Dificultad'
            name='difficulty'
            value={formik.values.difficulty}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.difficulty && Boolean(formik.errors.difficulty)
            }
            helperText={formik.touched.difficulty && formik.errors.difficulty}
            margin='normal'
            variant='outlined'
          >
            <MenuItem value='easy'>Fácil</MenuItem>
            <MenuItem value='medium'>Media</MenuItem>
            <MenuItem value='hard'>Difícil</MenuItem>
          </TextField>

          <TextField
            fullWidth
            id='time_limit'
            label='Tiempo Límite (HH:MM:SS)'
            name='time_limit'
            type='text'
            value={formik.values.time_limit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.time_limit && Boolean(formik.errors.time_limit)
            }
            helperText={formik.touched.time_limit && formik.errors.time_limit}
            margin='normal'
            variant='outlined'
            placeholder='HH:MM:SS'
          />

          {/* Selección de Tema */}
          <FormControl component='fieldset' sx={{ mt: 2 }}>
            <FormLabel component='legend'>Tema</FormLabel>
            <RadioGroup
              row
              name='topic'
              value={formik.values.topic}
              onChange={formik.handleChange}
            >
              <FormControlLabel
                value='SCRUM'
                control={<Radio />}
                label='SCRUM'
              />
              <FormControlLabel
                value='PMBOK'
                control={<Radio />}
                label='PMBOK'
              />
            </RadioGroup>
            {formik.touched.topic && formik.errors.topic && (
              <Alert severity='error'>{formik.errors.topic}</Alert>
            )}
          </FormControl>

          {/* Pistas Horizontales */}
          <Typography variant='h6' sx={{ my: 2 }}>
            Pistas Horizontales
          </Typography>
          {acrossClues.map((clue, index) => (
            <Box key={`across-${index}`} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label='Pista'
                value={clue.clue}
                onChange={(e) =>
                  handleClueChange('across', index, 'clue', e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <Box display='flex' alignItems='center'>
                <TextField
                  label='Respuesta'
                  value={clue.answer}
                  onChange={(e) =>
                    handleClueChange('across', index, 'answer', e.target.value)
                  }
                  sx={{ mr: 1 }}
                />
                <TextField
                  label='Fila'
                  type='number'
                  value={clue.row.toString()}
                  onChange={(e) =>
                    handleClueChange('across', index, 'row', e.target.value)
                  }
                  sx={{ mr: 1 }}
                />
                <TextField
                  label='Columna'
                  type='number'
                  value={clue.col.toString()}
                  onChange={(e) =>
                    handleClueChange('across', index, 'col', e.target.value)
                  }
                  sx={{ mr: 1 }}
                />
                <IconButton
                  color='error'
                  onClick={() => handleRemoveClue('across', index)}
                >
                  <Remove />
                </IconButton>
              </Box>
            </Box>
          ))}
          <Button onClick={() => handleAddClue('across')} sx={{ mt: 2 }}>
            <Add /> Agregar Pista Horizontal
          </Button>

          {/* Pistas Verticales */}
          <Typography variant='h6' sx={{ my: 2 }}>
            Pistas Verticales
          </Typography>
          {downClues.map((clue, index) => (
            <Box key={`down-${index}`} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label='Pista'
                value={clue.clue}
                onChange={(e) =>
                  handleClueChange('down', index, 'clue', e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <Box display='flex' alignItems='center'>
                <TextField
                  label='Respuesta'
                  value={clue.answer}
                  onChange={(e) =>
                    handleClueChange('down', index, 'answer', e.target.value)
                  }
                  sx={{ mr: 1 }}
                />
                <TextField
                  label='Fila'
                  type='number'
                  value={clue.row.toString()}
                  onChange={(e) =>
                    handleClueChange('down', index, 'row', e.target.value)
                  }
                  sx={{ mr: 1 }}
                />
                <TextField
                  label='Columna'
                  type='number'
                  value={clue.col.toString()}
                  onChange={(e) =>
                    handleClueChange('down', index, 'col', e.target.value)
                  }
                  sx={{ mr: 1 }}
                />
                <IconButton
                  color='error'
                  onClick={() => handleRemoveClue('down', index)}
                >
                  <Remove />
                </IconButton>
              </Box>
            </Box>
          ))}
          <Button onClick={() => handleAddClue('down')} sx={{ mt: 2 }}>
            <Add /> Agregar Pista Vertical
          </Button>

          {generalError && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {generalError}
            </Alert>
          )}

          <Button
            type='submit'
            fullWidth
            size='large'
            variant='contained'
            color='primary'
            sx={{ mt: 3 }}
          >
            Previsualizar
          </Button>
        </Box>
      </Box>

      {/* Diálogo de previsualización */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Previsualización del Crucigrama</DialogTitle>
        <DialogContent dividers>
          <Typography variant='h6'>Título: {formik.values.title}</Typography>
          <Typography variant='subtitle1'>
            Descripción: {formik.values.description}
          </Typography>
          <Typography variant='subtitle2' sx={{ mt: 1 }}>
            Dificultad: {formik.values.difficulty}
          </Typography>
          <Typography variant='subtitle2'>
            Tiempo Límite: {formik.values.time_limit}
          </Typography>
          <Typography variant='subtitle2'>
            Tema: {formik.values.topic}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Crossword
              ref={crosswordRef}
              storageKey={storageKey}
              data={{
                across: Object.fromEntries(
                  acrossClues.map((clue, i) => [
                    i + 1,
                    {
                      clue: clue.clue,
                      answer: clue.answer.toUpperCase(),
                      row: clue.row,
                      col: clue.col
                    }
                  ])
                ),
                down: Object.fromEntries(
                  downClues.map((clue, i) => [
                    i + 1,
                    {
                      clue: clue.clue,
                      answer: clue.answer.toUpperCase(),
                      row: clue.row,
                      col: clue.col
                    }
                  ])
                )
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)} color='primary'>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            color='primary'
            variant='contained'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
