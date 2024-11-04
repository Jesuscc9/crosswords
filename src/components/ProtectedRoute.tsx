import React from 'react'
import { Navigate } from 'react-router-dom'

import useSession from '../hooks/useSession'
import { LoadingPage } from '../pages/LoadingPage'

export const ProtectedRoute = ({ children }) => {
  const { session } = useSession()

  if (!session) {
    return <Navigate replace to='/' />
  }

  return children
}
