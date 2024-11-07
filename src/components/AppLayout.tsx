import { Box, Grid2 } from '@mui/material'
import { Navbar } from './Navbar'
import AppBg from '../assets/appbg.png'
import React from 'react'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid2
      container
      wrap='wrap'
      sx={{
        backgroundImage: `url('${AppBg}')`,
        backgroundSize: 'cover',
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        overflow: 'auto'
      }}
    >
      <Grid2 size={12} zIndex={2} position='fixed'>
        <Navbar></Navbar>
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
