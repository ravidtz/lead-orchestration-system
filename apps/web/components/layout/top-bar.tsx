'use client'
import { useAuthStore } from '@/store/auth.store'

export function TopBar() {
  const { user } = useAuthStore()

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-end px-6 sticky top-0 z-30">
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">{user.fullName ?? user.email}</span>
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-semibold">
            {(user.fullName ?? user.email)?.[0]?.toUpperCase()}
          </div>
        </div>
      )}
    </header>
  )
}
