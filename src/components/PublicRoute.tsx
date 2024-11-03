import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useSession from '../context/SessionContext/useSession'

export const PublicRoute = ({ children }) => {
  const { session } = useSession()

  if (!session) {
    return <>{children}</>
  }

  return <Navigate to='/crosswords' replace />
}
