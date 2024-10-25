import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

export const LoadingPage = () => {
  return (
    <div className="w-screen h-screen grid place-content-center">
      <CircularProgress />
    </div>
  )
}
