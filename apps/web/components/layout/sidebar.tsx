'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { createClient } from '@/lib/supabase'
import {
  LayoutDashboard, Users, UserCheck, MessageCircle, Phone,
  Settings, Shield, Menu, BriefcaseBusiness, LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/leads', label: 'לידים', icon: Users },
  { href: '/customers', label: 'לקוחות', icon: UserCheck },
  { href: '/conversations/chat', label: 'שיחות צ\'אט', icon: MessageCircle },
  { href: '/conversations/voice', label: 'שיחות קול', icon: Phone },
]

const adminItems = [
  { href: '/admin/users', label: 'משתמשים', icon: Shield },
  { href: '/admin/analytics', label: 'אנליטיקס', icon: LayoutDashboard },
  { href: '/admin/integrations', label: 'אינטגרציות', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  async function handleSignOut() {
    if (isSigningOut) return

    setIsSigningOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut({ scope: 'local' })
      router.push('/signin')
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <aside className={cn(
      'fixed top-0 right-0 h-full bg-surface border-l border-border flex flex-col transition-[width] duration-300 ease-out z-40',
      sidebarOpen ? 'w-60' : 'w-16',
    )}>
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-3 border-b border-border gap-3', !sidebarOpen && 'justify-center')}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
          aria-label={sidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
        >
          <Menu size={18} />
        </button>
        {sidebarOpen && (
          <>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent shadow-gold flex-shrink-0">
              <BriefcaseBusiness size={16} />
            </div>
            <span className="font-bold text-text-primary">CRM</span>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm',
              active
                ? 'bg-accent/15 text-accent border-r-2 border-accent'
                : 'text-text-secondary hover:bg-border hover:text-text-primary',
              !sidebarOpen && 'justify-center',
            )}>
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className={cn('pt-4 pb-1 px-3', !sidebarOpen && 'hidden')}>
              <span className="text-xs font-medium uppercase tracking-wider text-text-disabled">ניהול</span>
            </div>
            {adminItems.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link key={href} href={href} className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm',
                  active
                    ? 'bg-accent/15 text-accent border-r-2 border-accent'
                    : 'text-text-secondary hover:bg-border hover:text-text-primary',
                  !sidebarOpen && 'justify-center',
                )}>
                  <Icon size={18} className="flex-shrink-0" />
                  {sidebarOpen && <span>{label}</span>}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-all hover:bg-border hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60',
            !sidebarOpen && 'justify-center',
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {sidebarOpen && <span>{isSigningOut ? 'מתנתק...' : 'התנתק'}</span>}
        </button>
      </div>
    </aside>
  )
}
