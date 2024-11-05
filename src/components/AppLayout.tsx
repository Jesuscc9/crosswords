import { Box, Grid2 } from '@mui/material'
import { Navbar } from './Navbar'
import AppBg from '../assets/appbg.png'

export const AppLayout = ({ children }) => {
  return (
    <Grid2
      container
      direction={'column'}
      sx={{
        backgroundImage: `url('${AppBg}')`,
        backgroundSize: 'cover',
        height: '100vh',
        width: '100vw'
      }}
    >
      <Grid2 size={12}>
        <Navbar></Navbar>
        <Box position='relative' zIndex={0}>
          <div className='clouds'></div>
          <div className='clouds backwards'></div>
        </Box>
      </Grid2>
      <Grid2 size={12}>{children}</Grid2>
    </Grid2>
  )
}
