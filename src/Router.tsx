import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Login from './pages/LoginPage'
import SessionProvider from './context/SessionContext/SessionProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SessionProvider>
        <PublicRoute>
          <Login />
        </PublicRoute>
      </SessionProvider>
    )
  },
  {
    path: 'app',
    element: (
      <SessionProvider>
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      </SessionProvider>
    )
  }
])
