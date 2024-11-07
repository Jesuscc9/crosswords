import { createContext } from 'react'
import { Session } from '@supabase/supabase-js'

export interface iSessionContext {
  session: Session | null
  userRole: string | undefined
  signOut: () => void
  isLoading: boolean
}

const SessionContext = createContext<iSessionContext>({
  session: null,
  userRole: undefined,
  signOut: () => {},
  isLoading: true
})

export default SessionContext
