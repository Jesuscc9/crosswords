import Button from '@mui/material/Button'
import React from 'react'
import useSession from '../context/SessionContext/useSession'

export const LogoutButton: React.FC = () => {
  const { signOut } = useSession()

  return (
    <Button variant='contained' color='error' onClick={signOut}>
      Cerrar sesión
    </Button>
  )
}