import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import SessionContext, { iSessionContext } from './SessionContext'
import { jwtDecode } from 'jwt-decode'
import { Session } from '@supabase/supabase-js'
import { Database } from '../../types/db.types'

type role = Database['public']['Enums']['app_role']

export default function SessionProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<undefined | role>(undefined)
  // Session will be undefined at first, null in case the user is not logged in, and an object in case the user is logged in.

  const handleAccessToken = (session: Session | null) => {
    if (session?.access_token) {
      const jwt: any = jwtDecode(session?.access_token)
      setUserRole(jwt?.user_role as role)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoading(false)
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

  const value: iSessionContext = {
    session,
    signOut,
    userRole,
    isLoading
  }

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}
