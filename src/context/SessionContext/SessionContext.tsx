import { createContext } from 'react'

const SessionContext = createContext({
  session: undefined,
  userRole: undefined,
  signOut: () => {},
})

export default SessionContext
