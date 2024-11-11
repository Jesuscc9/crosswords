import { Database } from '../types/db.types'
import { supabase } from './supabase'

interface iCrosswordsOptions {
  difficulty?: Database['public']['Enums']['crossword_difficulty']
  topic?: Database['public']['Enums']['crossword_topic']
}

export const getCrosswords = ({ difficulty, topic }: iCrosswordsOptions) => {
  const selectStatement = supabase.from('crosswords')

  if (difficulty && topic) {
    selectStatement
      .select('*, user_progress (*)')
      .eq('difficulty', difficulty.toUpperCase())
      .eq('topic', topic.toUpperCase())
  }

  return selectStatement.select('*')
}
