import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid2'

export const SignupPage = () => {
  return (
    <Grid2 container>
      <Grid2 gridColumn={6}>
        <Box>
          <h1>Signup</h1>
          <form>
            <input type='text' placeholder='Username' />
            <input type='email' placeholder='Email' />
            <input type='password' placeholder='Password' />
            <button>Signup</button>
          </form>
        </Box>
      </Grid2>
      <Grid2 gridColumn={6}>Imagen bonita</Grid2>
    </Grid2>
  )
}
