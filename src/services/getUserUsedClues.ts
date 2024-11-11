import { supabase } from './supabase'

export const getUserUsedClues = (userId: string) => {
  return supabase.from('user_used_clues').select('*').eq('profile_id', userId)
}
