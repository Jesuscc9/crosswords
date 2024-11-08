import { createBrowserRouter } from 'react-router-dom'
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
import CrosswordsLevelsMenu from './pages/CrosswordsLevelMenu'
import LearningTopicPage from './pages/LearningTopicPage'
import { supabase } from './services/supabase'
import ProfileProvider from './context/ProfileContext/ProfileProvider'

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
        <ProfileProvider>
          <ProtectedRoute>
            <AppLayout>
              <MenuPage />
            </AppLayout>
          </ProtectedRoute>
        </ProfileProvider>
      </SessionProvider>
    )
  },
  {
    path: '/app/crosswords',
    element: (
      <SessionProvider>
        <ProfileProvider>
          <ProtectedRoute>
            <AppLayout>
              <MenuPage />
            </AppLayout>
          </ProtectedRoute>
        </ProfileProvider>
      </SessionProvider>
    )
  },
  {
    path: '/app/crosswords/list',
    element: (
      <SessionProvider>
        <ProfileProvider>
          <ProtectedRoute>
            <AppLayout>
              <CrosswordsListPage topic='SCRUM' />
            </AppLayout>
          </ProtectedRoute>
        </ProfileProvider>
      </SessionProvider>
    )
  },
  {
    path: '/app/crosswords/new',
    element: (
      <SessionProvider>
        <ProfileProvider>
          <ProtectedRoute>
            <AppLayout>
              <NewCrossword />
            </AppLayout>
          </ProtectedRoute>
        </ProfileProvider>
      </SessionProvider>
    )
  },
  {
    path: '/app/crosswords/:crosswordTopic/:crosswordDifficulty/levels',
    element: (
      <SessionProvider>
        <ProfileProvider>
          <ProtectedRoute>
            <AppLayout>
              <CrosswordsLevelsMenu />
            </AppLayout>
          </ProtectedRoute>
        </ProfileProvider>
      </SessionProvider>
    )
  },
  {
    path: '/app/crosswords/:crosswordTopic/:crosswordDifficulty/levels/tutorial',
    element: (
      <SessionProvider>
        <ProfileProvider>
          <ProtectedRoute>
            <AppLayout>
              <LearningTopicPage />
            </AppLayout>
          </ProtectedRoute>
        </ProfileProvider>
      </SessionProvider>
    )
  },
  {
    path: '/app/crosswords/:crosswordTopic/:crosswordDifficulty/levels/:crosswordId',
    element: (
      <SessionProvider>
        <ProfileProvider>
          <ProtectedRoute>
            <AppLayout>
              <CrosswordPage />
            </AppLayout>
          </ProtectedRoute>
        </ProfileProvider>
      </SessionProvider>
    )
  },
  {
    path: '/mail-confirmation',
    element: <MailConfirmation />
  },
  {
    path: '/',
    element: (
      <SessionProvider>
        <PublicRoute>
          <Login />
        </PublicRoute>
      </SessionProvider>
    )
  }
])
