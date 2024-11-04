import { useContext } from 'react'
import SessionContext from '../context/SessionContext/SessionContext'

const useSession = () => useContext(SessionContext)
export default useSession
