'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth.store'
import type { UserDTO } from '@crm/types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          id: data.user.id,
          orgId: data.user.user_metadata?.org_id ?? '',
          email: data.user.email ?? '',
          fullName: data.user.user_metadata?.full_name ?? null,
          role: data.user.user_metadata?.role ?? 'agent',
          avatarUrl: data.user.user_metadata?.avatar_url ?? null,
          isActive: true,
          createdAt: data.user.created_at,
        } satisfies UserDTO)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          orgId: session.user.user_metadata?.org_id ?? '',
          email: session.user.email ?? '',
          fullName: session.user.user_metadata?.full_name ?? null,
          role: session.user.user_metadata?.role ?? 'agent',
          avatarUrl: session.user.user_metadata?.avatar_url ?? null,
          isActive: true,
          createdAt: session.user.created_at,
        } satisfies UserDTO)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return <>{children}</>
}