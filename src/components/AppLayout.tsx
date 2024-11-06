import { Box, Grid2 } from '@mui/material'
import { Navbar } from './Navbar'
import AppBg from '../assets/appbg.png'

export const AppLayout = ({ children }) => {
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
      <Grid2 size={12} zIndex={1} position='fixed'>
        <Navbar></Navbar>
      </Grid2>
      <Box position='absolute'>
        <div className='clouds'></div>
        <div className='clouds backwards'></div>
      </Box>
      <br />
      <Grid2 size={12} pt={14}>
        {children}
      </Grid2>
    </Grid2>
  )
}
