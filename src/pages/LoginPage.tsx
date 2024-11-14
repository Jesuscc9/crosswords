import React from 'react'
import { supabase } from '../services/supabase'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import LoginImageBg from '../assets/loginbg.avif'
import 'nes.css/css/nes.min.css'
import { AppLayout } from '../components/AppLayout'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeError = location?.state?.error

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
        navigate('/app/crosswords', { replace: true })
      }

      setSubmitting(false)
    }
  })

  return (
    <AppLayout isPublic={true}>
      <div
        className='nes-container bg-yellow-500 max-w-[96%]'
        style={{
          textAlign: 'center',
          width: 600,
          margin: 'auto',
          marginTop: '3rem'
        }}
      >
        <h1 className='nes-text text-white'>Iniciar sesión</h1>
        <form onSubmit={formik.handleSubmit} style={{ marginTop: '2rem' }}>
          <div className='nes-field'>
            <label htmlFor='email' className='text-left'>
              Correo electrónico
            </label>
            <input
              type='email'
              id='email'
              name='email'
              className={`nes-input ${
                formik.touched.email && formik.errors.email ? 'is-error' : ''
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <span className='nes-text is-error text-left'>
                {formik.errors.email}
              </span>
            )}
          </div>

          <div className='nes-field' style={{ marginTop: '1rem' }}>
            <label htmlFor='password' className='text-left'>
              Contraseña
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className={`nes-input ${
                formik.touched.password && formik.errors.password
                  ? 'is-error'
                  : ''
              }`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <span className='nes-text is-error'>
                {formik.errors.password}
              </span>
            )}
          </div>

          {formik.errors.general && (
            <div className='nes-text is-error' style={{ marginTop: '1rem' }}>
              {formik.errors.general}
            </div>
          )}

          {routeError && (
            <div className='nes-text is-error' style={{ marginTop: '1rem' }}>
              {routeError}
            </div>
          )}

          <button
            type='submit'
            className={`nes-btn is-primary ${
              formik.isSubmitting ? 'is-disabled' : ''
            }`}
            style={{ width: '100%', marginTop: '1.5rem' }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Cargando...' : 'Continuar'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem' }}>
          <p className='nes-text'>
            ¿No tienes cuenta?{' '}
            <Link to='/register' className='nes-text is-primary'>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
