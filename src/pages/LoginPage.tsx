import React from 'react'
import {
  Box,
  TextField,
  Typography,
  Container,
  Alert,
  Grid2
} from '@mui/material'
import Button from '@mui/lab/LoadingButton'
import LoginImageBg from '../assets/loginbg.avif'
import { supabase } from '../services/supabase'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeError = location?.state?.error

  console.log({ routeError })

  // Validaciones con Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Correo electrónico no válido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es requerida')
  })

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true)
      const { email, password } = values

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setFieldError('general', error.message)
      } else {
        navigate('/app', {
          replace: true
        })
      }

      setSubmitting(false)
    }
  })

  return (
    <Grid2 container width='100vw' height='100vh'>
      <Grid2
        size={{
          xs: 12,
          md: 7,
          lg: 6
        }}
      >
        <Container component='main' maxWidth='xs'>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              Iniciar sesión
            </Typography>

            <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='email'
                label='Correo electrónico'
                name='email'
                autoComplete='email'
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                name='password'
                label='Contraseña'
                type='password'
                id='password'
                autoComplete='current-password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />

              {formik.errors.general && (
                <Alert severity='error'>{formik.errors.general}</Alert>
              )}

              {routeError && <Alert severity='error'>{routeError}</Alert>}

              <Button
                type='submit'
                fullWidth
                size='large'
                variant='contained'
                color='primary'
                sx={{ mt: 3, mb: 2 }}
                disabled={formik.isSubmitting}
                loading={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Cargando...' : 'Iniciar sesión'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Grid2>
      <Grid2
        size={{
          xs: 0,
          md: 5,
          lg: 6
        }}
      >
        <img
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          src={LoginImageBg}
          alt=''
        />
      </Grid2>
    </Grid2>
  )
}
