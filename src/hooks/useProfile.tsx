import { useContext } from 'react'
import ProfileContext from '../context/ProfileContext/ProfileContext'

const useProfile = () => useContext(ProfileContext)
export default useProfile
