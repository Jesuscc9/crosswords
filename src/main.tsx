import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/global.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router.tsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import 'nes.css/css/nes.min.css'
import { theme } from './components/Theme.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline></CssBaseline>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  </StrictMode>
)
