import { createContext } from 'react'
import { Database } from '../../types/db.types'

export type iProfile = Database['public']['Tables']['profiles']['Row']

export interface iProfileContext {
  profile: iProfile | undefined
}

const ProfileContext = createContext<iProfileContext>({
  profile: undefined
})

export default ProfileContext
