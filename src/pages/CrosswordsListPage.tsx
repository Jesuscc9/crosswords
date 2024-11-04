import React, { useEffect, useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper
} from '@mui/material'
import { supabase } from '../services/supabase'
import Crossword from '@jaredreisinger/react-crossword'
import CloseIcon from '@mui/icons-material/Close'

export default function CrosswordsListPage() {
  const [crosswords, setCrosswords] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedCrossword, setSelectedCrossword] = useState(null)

  useEffect(() => {
    // Función para cargar los crucigramas de la base de datos
    const fetchCrosswords = async () => {
      const { data, error } = await supabase.from('crosswords').select('*')
      if (error) {
        console.error('Error al cargar los crucigramas:', error)
      } else {
        setCrosswords(data)
      }
    }

    fetchCrosswords()
  }, [])

  const handlePreviewOpen = (crossword) => {
    setSelectedCrossword(crossword)
    setPreviewOpen(true)
  }

  const handlePreviewClose = () => {
    setSelectedCrossword(null)
    setPreviewOpen(false)
  }

  return (
    <Container component='main' maxWidth='md'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component='h1' variant='h5' gutterBottom>
          Lista de Crucigramas
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Dificultad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {crosswords.map((crossword) => (
                <TableRow key={crossword.id}>
                  <TableCell>{crossword.title}</TableCell>
                  <TableCell>{crossword.description}</TableCell>
                  <TableCell>{crossword.difficulty}</TableCell>
                  <TableCell>
                    <Button
                      variant='outlined'
                      onClick={() => handlePreviewOpen(crossword)}
                    >
                      Previsualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialogo para la previsualización del crucigrama */}
        <Dialog
          open={previewOpen}
          onClose={handlePreviewClose}
          maxWidth='md'
          fullWidth
        >
          <DialogTitle>
            Previsualización de Crucigrama
            <IconButton
              aria-label='close'
              onClick={handlePreviewClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedCrossword && selectedCrossword.data ? (
              <Crossword
                data={selectedCrossword.data}
                acrossLabel='Horizontal'
                downLabel='Vertical'
              />
            ) : (
              <Typography variant='body2' color='textSecondary'>
                No se pudo cargar el crucigrama.
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  )
}
