import { supabase } from './supabase'

export const getUserProgress = (userId: string) => {
  return supabase.from('user_progress').select('*').eq('profile_id', userId)
}
