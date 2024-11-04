import React, { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Container,
  Alert,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import Grid from '@mui/material/Grid'
import Button from '@mui/lab/LoadingButton'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { supabase } from '../services/supabase'
import { Add, Remove } from '@mui/icons-material'
import Crossword from '@jaredreisinger/react-crossword'

export const NewCrossword = () => {
  const navigate = useNavigate()

  // Estado para almacenar las pistas horizontales y verticales
  const [acrossClues, setAcrossClues] = useState([
    { clue: '', answer: '', row: '', col: '' }
  ])
  const [downClues, setDownClues] = useState([
    { clue: '', answer: '', row: '', col: '' }
  ])

  // Estado para controlar el diálogo de previsualización
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validación con Yup
  const validationSchema = Yup.object({
    title: Yup.string().required('El título es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    difficulty: Yup.string()
      .oneOf(['easy', 'medium', 'hard'], 'Selecciona una dificultad válida')
      .required('La dificultad es requerida'),
    time_limit: Yup.number()
      .positive('El tiempo límite debe ser positivo')
      .integer('Debe ser un número entero')
      .required('El tiempo límite es requerido')
  })

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      difficulty: '',
      time_limit: ''
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      setPreviewOpen(true) // Abre el diálogo de previsualización en lugar de enviar directamente
    }
  })

  // Maneja el envío definitivo al confirmar en el diálogo
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)
    const { title, description, difficulty, time_limit } = formik.values

    // Formatear las pistas en el formato adecuado para el componente Crossword
    const formattedData = {
      across: Object.fromEntries(
        acrossClues.map((clue, index) => [
          index + 1,
          {
            clue: clue.clue,
            answer: clue.answer.toUpperCase(),
            row: parseInt(clue.row, 10),
            col: parseInt(clue.col, 10)
          }
        ])
      ),
      down: Object.fromEntries(
        downClues.map((clue, index) => [
          index + 1,
          {
            clue: clue.clue,
            answer: clue.answer.toUpperCase(),
            row: parseInt(clue.row, 10),
            col: parseInt(clue.col, 10)
          }
        ])
      )
    }

    try {
      const { error } = await supabase.from('crosswords').insert([
        {
          title,
          description,
          difficulty,
          time_limit: `${time_limit} minutes`,
          data: formattedData
        }
      ])

      if (error) {
        formik.setFieldError('general', error.message)
      } else {
        navigate('/crosswords', { replace: true })
      }
    } catch (error) {
      console.error(error)
      formik.setFieldError('general', 'Error inesperado')
    }

    setIsSubmitting(false)
    setPreviewOpen(false) // Cierra el diálogo después de enviar
  }

  const handleAddClue = (type) => {
    const newClue = { clue: '', answer: '', row: '', col: '' }
    type === 'across'
      ? setAcrossClues([...acrossClues, newClue])
      : setDownClues([...downClues, newClue])
  }

  const handleRemoveClue = (type, index) => {
    type === 'across'
      ? setAcrossClues(acrossClues.filter((_, i) => i !== index))
      : setDownClues(downClues.filter((_, i) => i !== index))
  }

  const handleClueChange = (type, index, field, value) => {
    const updateClues = (clues) =>
      clues.map((clue, i) => (i === index ? { ...clue, [field]: value } : clue))
    type === 'across'
      ? setAcrossClues(updateClues(acrossClues))
      : setDownClues(updateClues(downClues))
  }

  return (
    <Container component='main' maxWidth='md'>
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
            label='Tiempo Límite (minutos)'
            name='time_limit'
            type='number'
            value={formik.values.time_limit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.time_limit && Boolean(formik.errors.time_limit)
            }
            helperText={formik.touched.time_limit && formik.errors.time_limit}
            margin='normal'
            variant='outlined'
          />

          {/* Pistas Horizontales */}
          <Typography variant='h6' sx={{ my: 2 }}>
            Pistas Horizontales
          </Typography>
          {acrossClues.map((clue, index) => (
            <Grid container spacing={2} key={`across-${index}`}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Pista'
                  value={clue.clue}
                  onChange={(e) =>
                    handleClueChange('across', index, 'clue', e.target.value)
                  }
                  margin='normal'
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label='Respuesta'
                  value={clue.answer}
                  onChange={(e) =>
                    handleClueChange('across', index, 'answer', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label='Fila'
                  type='number'
                  value={clue.row}
                  onChange={(e) =>
                    handleClueChange('across', index, 'row', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label='Columna'
                  type='number'
                  value={clue.col}
                  onChange={(e) =>
                    handleClueChange('across', index, 'col', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  color='error'
                  onClick={() => handleRemoveClue('across', index)}
                >
                  <Remove />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button onClick={() => handleAddClue('across')} sx={{ mt: 2 }}>
            <Add /> Agregar Pista Horizontal
          </Button>

          {/* Pistas Verticales */}
          <Typography variant='h6' sx={{ my: 2 }}>
            Pistas Verticales
          </Typography>
          {downClues.map((clue, index) => (
            <Grid container spacing={2} key={`down-${index}`}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Pista'
                  value={clue.clue}
                  onChange={(e) =>
                    handleClueChange('down', index, 'clue', e.target.value)
                  }
                  margin='normal'
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label='Respuesta'
                  value={clue.answer}
                  onChange={(e) =>
                    handleClueChange('down', index, 'answer', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label='Fila'
                  type='number'
                  value={clue.row}
                  onChange={(e) =>
                    handleClueChange('down', index, 'row', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label='Columna'
                  type='number'
                  value={clue.col}
                  onChange={(e) =>
                    handleClueChange('down', index, 'col', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  color='error'
                  onClick={() => handleRemoveClue('down', index)}
                >
                  <Remove />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button onClick={() => handleAddClue('down')} sx={{ mt: 2 }}>
            <Add /> Agregar Pista Vertical
          </Button>

          {formik.errors.general && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {formik.errors.general}
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
            Tiempo Límite: {formik.values.time_limit} minutos
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Crossword
              data={{
                across: Object.fromEntries(
                  acrossClues.map((clue, i) => [
                    i + 1,
                    {
                      clue: clue.clue,
                      answer: clue.answer.toUpperCase(),
                      row: parseInt(clue.row),
                      col: parseInt(clue.col)
                    }
                  ])
                ),
                down: Object.fromEntries(
                  downClues.map((clue, i) => [
                    i + 1,
                    {
                      clue: clue.clue,
                      answer: clue.answer.toUpperCase(),
                      row: parseInt(clue.row),
                      col: parseInt(clue.col)
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
