import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/global.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router.tsx'
import { CssBaseline } from '@mui/material'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline></CssBaseline>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
)
