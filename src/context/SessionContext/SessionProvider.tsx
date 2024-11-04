import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import SessionContext from './SessionContext'
import { jwtDecode } from 'jwt-decode'
import { Session } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'

export default function SessionProvider({ children }) {
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState(undefined)
  // Session will be undefined at first, null in case the user is not logged in, and an object in case the user is logged in.

  const handleAccessToken = (session: any) => {
    if (session?.access_token) {
      const jwt = jwtDecode(session?.access_token)
      setUserRole(jwt?.user_role as any)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAccessToken(session)
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      handleAccessToken(session)
      setSession(session)
    })
  }, [])

  const signOut = () => {
    supabase.auth.signOut()
  }

  const value = {
    session,
    signOut,
    userRole
  }

  return (
    <SessionContext.Provider value={value as any}>
      {children}
    </SessionContext.Provider>
  )
}
