import React, { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import RegisterImageBg from '../assets/loginbg.avif'
import 'nes.css/css/nes.min.css'
import { AppLayout } from '../components/AppLayout'

interface iSignupForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const navigate = useNavigate()
  const [isRegistered, setIsRegistered] = useState(false)

  // Validaciones con Yup
  const validationSchema = Yup.object<iSignupForm>({
    username: Yup.string().required('El nombre de usuario es requerido'),
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
  const formik = useFormik<iSignupForm>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true)
      const { username, email, password } = values

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      })

      if (error) {
        setFieldError('general', error.message)
      } else {
        setIsRegistered(true)
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
        {!isRegistered ? (
          <>
            <h1 className='nes-text text-white'>Crear cuenta</h1>
            <form onSubmit={formik.handleSubmit} style={{ marginTop: '2rem' }}>
              <div className='nes-field'>
                <label htmlFor='username' className='text-left'>
                  Nombre de usuario
                </label>
                <input
                  type='text'
                  id='username'
                  name='username'
                  className={`nes-input ${
                    formik.touched.username && formik.errors.username
                      ? 'is-error'
                      : ''
                  }`}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                  <span className='nes-text is-error'>
                    {formik.errors.username}
                  </span>
                )}
              </div>

              <div className='nes-field' style={{ marginTop: '1rem' }}>
                <label htmlFor='email' className='text-left'>
                  Correo electrónico
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  className={`nes-input ${
                    formik.touched.email && formik.errors.email
                      ? 'is-error'
                      : ''
                  }`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <span className='nes-text is-error'>
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

              <div className='nes-field' style={{ marginTop: '1rem' }}>
                <label htmlFor='confirmPassword' className='text-left'>
                  Confirmar contraseña
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  className={`nes-input ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? 'is-error'
                      : ''
                  }`}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <span className='nes-text is-error'>
                      {formik.errors.confirmPassword}
                    </span>
                  )}
              </div>

              {formik.errors.general && (
                <div
                  className='nes-text is-error'
                  style={{ marginTop: '1rem' }}
                >
                  {formik.errors.general}
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
                {formik.isSubmitting ? 'Registrando...' : 'Crear cuenta'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem' }}>
              <p className='nes-text'>
                ¿Ya tienes cuenta?{' '}
                <Link to='/login' className='nes-text is-primary'>
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            <h1 className='nes-text is-success'>Registro exitoso</h1>
            <p className='nes-text'>Revisa tu correo y confirma tu cuenta.</p>
            <button
              className='nes-btn is-primary'
              onClick={() => navigate('/login')}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
