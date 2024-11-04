import { Navigate } from 'react-router-dom'
import useSession from '../hooks/useSession'

export const PublicRoute = ({ children }) => {
  const { session } = useSession()

  if (!session) {
    return <>{children}</>
  }

  return <Navigate to='/app/crosswords' replace />
}
