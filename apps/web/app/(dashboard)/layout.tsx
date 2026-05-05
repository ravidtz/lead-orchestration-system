"use client"

import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Toaster } from '@/components/ui'
import { AuthProvider } from '@/components/auth/auth-provider'
import { useUIStore } from '@/store/ui.store'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: import('react').ReactNode }) {
  const { sidebarOpen } = useUIStore()

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className={cn(
          'flex-1 flex flex-col transition-[margin] duration-300 ease-out',
          sidebarOpen ? 'md:mr-60' : 'md:mr-16',
        )}>
          <TopBar />
          {children}
        </div>
        <BottomNav />
        <Toaster />
      </div>
    </AuthProvider>
  )
}