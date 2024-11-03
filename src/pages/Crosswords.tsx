import { AppLayout } from '../components/AppLayout'
import { supabase } from '../services/supabase'
import useSWR from 'swr'

const fetchCrosswords = async () => {
  const { data, error } = await supabase.from('crosswords').select('*')
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const Crosswords = () => {
  const { data, error } = useSWR('/crosswords', fetchCrosswords)

  console.log({ data })

  return <AppLayout>hola</AppLayout>
}
