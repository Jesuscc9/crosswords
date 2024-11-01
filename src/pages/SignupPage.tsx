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
import RegisterImageBg from '../assets/loginbg.avif'
import { supabase } from '../services/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function Register() {
  const navigate = useNavigate()

  // Validaciones con Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    email: Yup.string()
      .email('Correo electrónico no válido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es requerida'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('La confirmación de contraseña es requerida')
  })

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true)
      const { name, email, password } = values

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })

      if (error) {
        setFieldError('general', error.message)
      } else {
        navigate('/login', {
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
              Crear cuenta
            </Typography>

            <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='name'
                label='Nombre'
                name='name'
                autoComplete='name'
                autoFocus
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='email'
                label='Correo electrónico'
                name='email'
                autoComplete='email'
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
                autoComplete='new-password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                name='confirmPassword'
                label='Confirmar contraseña'
                type='password'
                id='confirmPassword'
                autoComplete='new-password'
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              />

              {formik.errors.general && (
                <Alert severity='error'>{formik.errors.general}</Alert>
              )}

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
                {formik.isSubmitting ? 'Registrando...' : 'Crear cuenta'}
              </Button>

              <Box sx={{ mt: 2 }}>
                <Typography variant='body2'>
                  ¿Ya tienes cuenta?{' '}
                  <Link to='/login' style={{ color: '#1976d2' }}>
                    Inicia sesión aquí
                  </Link>
                </Typography>
              </Box>
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
          src={RegisterImageBg}
          alt=''
        />
      </Grid2>
    </Grid2>
  )
}
