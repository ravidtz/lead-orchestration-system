'use client'
import { PageShell, PageHeader } from '@/components/layout/page-shell'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui'
const Badge = dynamic(() => import('@/components/ui/badge').then(m => m.Badge), { loading: () => null })
const TableSkeleton = dynamic(() => import('@/components/ui/skeleton').then(m => m.TableSkeleton), { loading: () => null })
const EmptyState = dynamic(() => import('@/components/shared/empty-state').then(m => m.EmptyState), { loading: () => null })
import React from 'react'
import { api } from '@/lib/api-client'
import useSWR from 'swr'
import type { UserDTO } from '@crm/types'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default function AdminUsersPage() {
  const { data, isLoading } = useSWR('/admin/users', (url: string) => api.get<{ data: UserDTO[] }>(url))

  const roleColor = (role: string) => ({
    super_admin: 'purple', admin: 'blue', agent: 'green', viewer: 'gray',
  }[role] ?? 'gray')

  const roleLabel = (role: string) => ({
    super_admin: 'סופר מנהל', admin: 'מנהל', agent: 'סוכן', viewer: 'צופה',
  }[role] ?? role)

  return (
    <PageShell>
      <PageHeader
        title="ניהול משתמשים"
        action={<Button><Plus size={16} />הזמן משתמש</Button>}
      />

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-border text-xs font-medium uppercase tracking-wider text-text-disabled">
          <span>שם</span>
          <span>אימייל</span>
          <span>תפקיד</span>
          <span>סטטוס</span>
          <span>נוצר</span>
        </div>

        {isLoading && <TableSkeleton rows={5} cols={5} />}

        {!isLoading && data?.data.length === 0 && (
          <EmptyState title="אין משתמשים" />
        {data?.data.map(React.useMemo(() => {
          const UserRow = React.memo(function UserRow({ user }: { user: any }) {
            return (
              <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-4 py-3.5 border-b border-border last:border-0 items-center text-sm">
                <span className="font-medium text-text-primary">{user.fullName ?? '—'}</span>
                <span className="text-text-secondary">{user.email}</span>
                <Badge label={roleLabel(user.role)} color={roleColor(user.role) as any} />
                <Badge label={user.isActive ? 'פעיל' : 'מושבת'} color={user.isActive ? 'green' : 'red'} />
                <span className="text-text-secondary">{formatDate(user.createdAt)}</span>
              </div>
            )
          })
          return (user: any) => <UserRow key={user.id} user={user} />
        }, [data?.data]))}
          </div>
        ))}
      </div>
    </PageShell>
  )
}
