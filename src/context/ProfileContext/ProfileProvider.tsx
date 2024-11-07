import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import ProfileContext, { iProfileContext } from './ProfileContext'
import { Database } from '../../types/db.types'

type iProfile = Database['public']['Tables']['profiles']['Row']

export default function ProfileProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [profile, setProfile] = useState<iProfile | undefined>(undefined)

  const fetchUserProfile = async () => {
    // Obtener el user_id de la sesión actual de Supabase
    const {
      data: { session }
    } = await supabase.auth.getSession()
    const user_id = session?.user.id

    if (user_id) {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(profileData)
      }
    }
  }

  useEffect(() => {
    // Ejecutar la carga del perfil al montar el componente
    fetchUserProfile()

    // Suscribirse a cambios en el estado de autenticación, recargar el perfil si cambia
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      fetchUserProfile()
    })

    // Limpiar la suscripción al desmontar el componente
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const value: iProfileContext = {
    profile
  }

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}
