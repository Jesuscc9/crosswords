import { createBrowserRouter, Outlet } from 'react-router-dom'
import App from './App'
import Login from './pages/LoginPage'
import SessionProvider from './context/SessionContext/SessionProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import Register from './pages/SignupPage'
import CrosswordsListPage from './pages/CrosswordsListPage'
import MailConfirmation from './pages/MailConfirmation'
import { NewCrossword } from './pages/NewCrossword'
import { AppLayout } from './components/AppLayout'
import CrosswordPage from './pages/CrosswordPage'
import { MenuPage } from './pages/MenuPage'

export const router = createBrowserRouter([
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
    path: '/app',
    element: (
      <SessionProvider>
        <ProtectedRoute>
          <AppLayout>
            <Outlet />
          </AppLayout>
          {/* render nested route */}
        </ProtectedRoute>
      </SessionProvider>
    ),
    children: [
      {
        path: 'crosswords',
        element: <MenuPage />
      },
      {
        path: 'crosswords/:id',
        element: <CrosswordPage />
      },
      {
        path: 'crosswords/new',
        element: <NewCrossword />
      }
    ]
  },
  {
    path: '/mail-confirmation',
    element: <MailConfirmation />
  },
  {
    path: '*',
    element: (
      <SessionProvider>
        <PublicRoute>
          <Login />
        </PublicRoute>
      </SessionProvider>
    )
  }
])
