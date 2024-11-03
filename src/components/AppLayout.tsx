import { Grid2 } from '@mui/material'
import { Navbar } from './Navbar'

export const AppLayout = ({ children }) => {
  return (
    <Grid2 container>
      <Navbar></Navbar>
      <Grid2 size={12}>{children}</Grid2>
    </Grid2>
  )
}
