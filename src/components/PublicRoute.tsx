import { Navigate, useLocation } from 'react-router-dom'
import useSession from '../hooks/useSession'

export const PublicRoute = ({ children }) => {
  const { session } = useSession()
  const { pathname } = useLocation()

  if (!session) {
    return <>{children}</>
  }

  return <Navigate to='/app/crosswords' replace />
}
