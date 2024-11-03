import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Login from './pages/LoginPage'
import SessionProvider from './context/SessionContext/SessionProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import Register from './pages/SignupPage'
import { Crosswords } from './pages/Crosswords'
import MailConfirmation from './pages/MailConfirmation'

export const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <SessionProvider>
        <PublicRoute>
          <Login />
        </PublicRoute>
      </SessionProvider>
    )
  },
  {
    path: '/register',
    element: (
      <SessionProvider>
        <PublicRoute>
          <Register />
        </PublicRoute>
      </SessionProvider>
    )
  },
  {
    path: '/crosswords',
    element: (
      <SessionProvider>
        <ProtectedRoute>
          <Crosswords />
        </ProtectedRoute>
      </SessionProvider>
    )
  },
  {
    path: '/crossword/:id',
    element: (
      <SessionProvider>
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      </SessionProvider>
    )
  },

  {
    path: '/mail-confirmation',
    element: <MailConfirmation />
  }
])
