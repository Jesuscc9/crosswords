import { Box, Grid2 } from '@mui/material'
import { Navbar } from './Navbar'
import DayScrumBG from '../assets/day-bg-1.webp'
import NightScrumBG from '../assets/nightbg-1.webp'
import DayPembokBG from '../assets/daybg2.webp'
import NightPembokBG from '../assets/nightbg2.webp'
import PublicBG from '../assets/public-bg-1.webp'
import DarkPublicBG from '../assets/dark-public-bg.webp'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useColorScheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

export const AppLayout = ({
  children,
  isPublic = false
}: {
  children: React.ReactNode
  isPublic: boolean
}) => {
  const { crosswordTopic } = useParams()
  const { mode } = useColorScheme()

  const backgrounds = {
    scrum: {
      light: DayScrumBG,
      dark: NightScrumBG
    },
    pmbok: {
      light: DayPembokBG,
      dark: NightPembokBG
    },
    public: {
      light: PublicBG,
      dark: DarkPublicBG
    }
  }

  console.log('mode', mode)

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  let currentMode = mode

  if (currentMode === 'system') {
    currentMode = prefersDarkMode ? 'dark' : 'light'
  } else {
    currentMode = mode
  }

  const bg =
    isPublic || !crosswordTopic
      ? backgrounds.public[currentMode]
      : backgrounds[crosswordTopic ?? 'scrum'][currentMode]

  return (
    <Grid2
      container
      wrap='wrap'
      sx={{
        backgroundImage: `url('${bg}')`,
        backgroundSize: 'cover',
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        overflow: 'auto',
        backgroundPosition: 'center'
      }}
    >
      <Grid2 size={12} zIndex={2} position='fixed'>
        {isPublic === true ? null : <Navbar></Navbar>}
      </Grid2>
      <Box
        position='absolute'
        zIndex={0}
        sx={{
          opacity: currentMode === 'dark' ? 0.5 : 1
        }}
      >
        <div className='clouds'></div>
        <div className='clouds backwards'></div>
      </Box>
      <br />
      <Grid2 size={12} pt={14} zIndex={1}>
        {children}
      </Grid2>
    </Grid2>
  )
}
