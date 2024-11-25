import React, { useEffect } from 'react'
import 'nes.css/css/nes.min.css'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { supabase } from '../services/supabase'
import useProfile from '../hooks/useProfile'

export const MenuPage: React.FC = () => {
  const [scrumPercentage, setScrumPercentage] = React.useState('0')
  const [pmbokPercentage, setPmbokPercentage] = React.useState('0')

  const { profile } = useProfile()

  useEffect(() => {
    if (!profile) return

    const getTopicCompletionPercentage = async (topic: string) => {
      const { data } = await supabase
        .from('crosswords')
        .select('*')
        .eq('topic', topic)

      const totalLevels = data?.length

      const { data: completedData } = await supabase
        .from('user_progress')
        .select('*, crosswords(*)')
        .eq('crosswords.topic', topic)
        .eq('completed', true)
        .eq('profile_id', profile?.id)

      console.log(topic)
      console.log({ completedData })

      const completedLevelsIds = new Set()

      completedData?.forEach((e) => {
        completedLevelsIds.add(e?.crosswords?.id)
      })

      console.log({ completedLevelsIds })

      const completedLevels = completedData?.length

      console.log({ totalLevels, completedLevels })

      if (!totalLevels || !completedLevels) return 0

      const division = completedLevelsIds.size / totalLevels

      if (topic === 'SCRUM')
        setScrumPercentage((Number(division) * 100).toFixed(0))
      else if (topic === 'PMBOK')
        setPmbokPercentage((Number(division) * 100).toFixed(0))
    }

    getTopicCompletionPercentage('SCRUM')
    getTopicCompletionPercentage('PMBOK')
  }, [profile])

  console.log({ scrumPercentage })

  return (
    <Box p={2} width={900} maxWidth='90%' mx='auto'>
      <section className=''>
        <section className='message-list'>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            className='message -right'
          >
            <div className='nes-balloon from-right'>
              <Typography>
                Selecciona un tema de las opciones para comenzar a aprender!
              </Typography>
            </div>

            <div className='w-[144px] h-[144px]'>
              <i className='nes-kirby transform origin-top-left scale-150'></i>
            </div>
          </Box>
        </section>
      </section>

      <div className='flex w-full py-4 mt-8 md:mt-16 justify-between gap-8 flex-col md:flex-row'>
        <Link
          to='scrum/easy/levels'
          className='nes-btn is-primary !p-4 !md:p-8 w-full'
          style={{ fontSize: '1.5rem' }}
        >
          SCRUM
          <Box mt={4} display='flex' alignItems='center' gap={2}>
            <progress
              className='nes-progress !h-[30px] md:!h-[48px]'
              value={scrumPercentage}
              max='100'
            ></progress>
            <p
              style={{
                margin: 0
              }}
            >
              {scrumPercentage}%
            </p>
          </Box>
        </Link>

        <Link
          to='pmbok/easy/levels'
          className='nes-btn is-warning w-full !p-4 md:!p-8'
          style={{ fontSize: '1.5rem' }}
        >
          PMBOK
          <Box mt={4} display='flex' alignItems='center' gap={2}>
            <progress
              className='nes-progress !h-[30px] md:!h-[48px]'
              value={pmbokPercentage}
              max='100'
            ></progress>
            <p
              style={{
                margin: 0
              }}
            >
              {pmbokPercentage}%
            </p>
          </Box>
        </Link>
      </div>
    </Box>
  )
}
