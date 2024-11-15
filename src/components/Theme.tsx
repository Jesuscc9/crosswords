import { createTheme } from '@mui/material'

export const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true
  },
  typography: {
    fontFamily: 'myFont',
    h1: {
      color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black')
    },
    h2: {
      color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black')
    },
    body1: {
      color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black')
    }
  }
})
