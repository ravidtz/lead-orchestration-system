'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, UserCheck, MessageCircle, Settings } from 'lucide-react'

const items = [
  { href: '/', icon: LayoutDashboard, label: 'ראשי' },
  { href: '/leads', icon: Users, label: 'לידים' },
  { href: '/customers', icon: UserCheck, label: 'לקוחות' },
  { href: '/conversations/chat', icon: MessageCircle, label: 'שיחות' },
  { href: '/admin/users', icon: Settings, label: 'ניהול' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-surface border-t border-border flex items-center justify-around z-40 md:hidden">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href))
        return (
          <Link key={href} href={href} className={cn(
            'flex flex-col items-center gap-1 text-xs transition-colors',
            active ? 'text-accent' : 'text-text-secondary',
          )}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
