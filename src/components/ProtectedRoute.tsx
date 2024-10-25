import React from 'react'
import { Navigate } from 'react-router-dom'

import useSession from '../context/SessionContext/useSession'
import { LoadingPage } from '../pages/LoadingPage'

export const ProtectedRoute = ({ children }) => {
  const { session } = useSession()

  if (!session) {
    // toast.error('Necesitas iniciar sesión para acceder a esta página', {
    //   position: 'bottom-left',
    // })
    return <Navigate replace={false} to='/' />
  }

  return children
}
