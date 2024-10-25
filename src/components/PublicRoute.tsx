import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useSession from '../context/SessionContext/useSession'

export const PublicRoute = ({ children }) => {
  const { session } = useSession()
  const navigate = useNavigate()
  console.log({ session })

  if (!session) {
    return <>{children}</>
  }

  return navigate('/app', { replace: true })
}
