import { Box, Typography, Container, Grid2 } from '@mui/material'
import Button from '@mui/lab/LoadingButton'
import LoginImageBg from '../assets/loginbg.avif'
import { useNavigate } from 'react-router-dom'

export default function MailConfirmation() {
  const navigate = useNavigate()

  return (
    <Grid2 container width='100vw' height='100vh'>
      <Grid2
        size={{
          xs: 12,
          md: 7,
          lg: 6
        }}
      >
        <Container component='main' maxWidth='xs'>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              Correo Confirmado
            </Typography>
            <Typography
              variant='body1'
              sx={{ mt: 3, mb: 3, textAlign: 'center' }}
            >
              Tu correo electrónico ha sido confirmado exitosamente. Ahora
              puedes iniciar sesión en tu cuenta.
            </Typography>

            <Button
              variant='contained'
              color='primary'
              onClick={() => navigate('/login')}
              fullWidth
              size='large'
            >
              Ir a Iniciar Sesión
            </Button>
          </Box>
        </Container>
      </Grid2>
      <Grid2
        size={{
          xs: 0,
          md: 5,
          lg: 6
        }}
      >
        <img
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          src={LoginImageBg}
          alt=''
        />
      </Grid2>
    </Grid2>
  )
}
