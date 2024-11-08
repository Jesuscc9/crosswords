import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button
} from '@mui/material'

interface ErrorDialogProps {
  open: boolean
  onClose: () => void
  title: string
  message: string
}

export const ErrorDialog = ({
  open,
  onClose,
  title,
  message
}: ErrorDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography variant='body1'>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Volver</Button>
    </DialogActions>
  </Dialog>
)
