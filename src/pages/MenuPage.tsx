import React from 'react'
import 'nes.css/css/nes.min.css'
import ScrumIcon from '../assets/scrum-icon.png'
import { Box } from '@mui/material'

export const MenuPage: React.FC = () => {
  return (
    <Box p={2} mt={6} width={800} mx='auto'>
      <section className=''>
        <section className='message-list'>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            className='message -right'
          >
            <div className='nes-balloon from-right'>
              <p>
                Selecciona un tema de las opciones para comenzar a aprender!
              </p>
            </div>

            <div>
              <i className='nes-charmander'></i>
            </div>
          </Box>
        </section>
      </section>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '4rem',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <button
          className='nes-btn is-primary'
          style={{ padding: '2rem', fontSize: '1.5rem' }}
        >
          SCRUM
          <br />
          <br />
          {/* <div>
            <img src={ScrumIcon} width={50} height={50} />
          </div> */}
          <progress className='nes-progress' value='90' max='100'></progress>
        </button>
        <button
          className='nes-btn is-warning'
          style={{ padding: '2rem', fontSize: '1.5rem' }}
        >
          PEMBOK
          <br />
          <br />
          <progress className='nes-progress' value='90' max='100'></progress>
        </button>
      </div>
    </Box>
  )
}
