import Crossword from '@jaredreisinger/react-crossword'
import { ThemeProvider } from '@jaredreisinger/react-crossword'

const data = {
  across: {
    1: {
      clue: 'El rol encargado de maximizar el valor del producto (13)',
      answer: 'PRODUCTOWNER',
      row: 3,
      col: 2
    },
    4: {
      clue: 'Período de tiempo en el cual el equipo desarrolla una funcionalidad (6)',
      answer: 'SPRINT',
      row: 5,
      col: 5
    },
    6: {
      clue: 'Evento clave donde el equipo reflexiona y adapta su trabajo (13)',
      answer: 'RETROSPECTIVA',
      row: 7,
      col: 2
    }
  },
  down: {
    1: {
      clue: 'Lista de tareas que deben completarse en el sprint (7)',
      answer: 'BACKLOG',
      row: 0,
      col: 0
    },
    2: {
      clue: 'Rol del líder facilitador del equipo Scrum (11)',
      answer: 'SCRUMMASTER',
      row: 0,
      col: 2
    },
    5: {
      clue: 'Evento donde se revisa el progreso hacia el objetivo del sprint (13)',
      answer: 'SPRINTREVIEW',
      row: 3,
      col: 6
    }
  }
}

function App() {
  return (
    <div className='w-screen h-screen grid place-items-center'>
      <div className='w-[500px]'>
        <h1 className='text-3xl text-center font-bold mb-10'>
          Crucigrama de Scrum
        </h1>
        <ThemeProvider
          theme={{
            textColor: '#000'
          }}
        >
          <Crossword acrossLabel='Horizontal' data={data} />
        </ThemeProvider>
      </div>
    </div>
  )
}

export default App
