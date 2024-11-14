import { Box, Grid2 } from '@mui/material'
import { Navbar } from './Navbar'
import AppBg from '../assets/bg3.png'
import ScrumBG from '../assets/scrumbg.png'
import PembokBG from '../assets/pembookbg.png'
import React from 'react'
import { useLocation } from 'react-router-dom'

export const AppLayout = ({
  children,
  isPublic = false
}: {
  children: React.ReactNode
  isPublic: boolean
}) => {
  const { pathname } = useLocation()

  const bg = pathname.includes('scrum')
    ? ScrumBG
    : pathname.includes('pmbok')
    ? PembokBG
    : AppBg

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
        overflow: 'auto'
      }}
    >
      <Grid2 size={12} zIndex={2} position='fixed'>
        {isPublic === true ? null : <Navbar></Navbar>}
      </Grid2>
      <Box position='absolute' zIndex={0}>
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
