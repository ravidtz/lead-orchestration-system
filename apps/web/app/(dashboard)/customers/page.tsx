'use client'
import { PageShell, PageHeader } from '@/components/layout/page-shell'
import { TableSkeleton, Badge, Button } from '@/components/ui'
import { EmptyState } from '@/components/shared/empty-state'
import { useCustomers } from '@/hooks/use-customers'
import { CUSTOMER_STATUSES, CUSTOMER_TIERS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

export default function CustomersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useCustomers({ page })

  const statusColor = (s: string) => CUSTOMER_STATUSES.find(x => x.value === s)?.color ?? 'gray'
  const statusLabel = (s: string) => CUSTOMER_STATUSES.find(x => x.value === s)?.label ?? s
  const tierLabel = (t: string) => CUSTOMER_TIERS.find(x => x.value === t)?.label ?? t

  return (
    <PageShell>
      <PageHeader
        title="לקוחות"
        subtitle={data ? `${data.meta.total} לקוחות בסך הכל` : undefined}
      />

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-border text-xs font-medium uppercase tracking-wider text-text-disabled">
          <span>שם</span>
          <span>חברה / אימייל</span>
          <span>סטטוס</span>
          <span>דרגה</span>
          <span>נוצר</span>
        </div>

        {isLoading && <TableSkeleton rows={8} cols={5} />}

        {!isLoading && data?.data.length === 0 && (
          <EmptyState title="אין לקוחות עדיין" description="המר ליד ללקוח כדי להתחיל" />
        )}

        {data?.data.map(customer => (
          <Link
            key={customer.id}
            href={`/customers/${customer.id}`}
            className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-4 py-3.5 border-b border-border last:border-0 hover:bg-border/50 transition-colors items-center text-sm"
          >
            <span className="font-medium text-text-primary">{customer.firstName} {customer.lastName}</span>
            <span className="text-text-secondary">{customer.company ?? customer.email ?? '—'}</span>
            <Badge label={statusLabel(customer.status)} color={statusColor(customer.status) as any} />
            <span className="text-text-secondary">{tierLabel(customer.tier)}</span>
            <span className="text-text-secondary">{formatDate(customer.createdAt)}</span>
          </Link>
        ))}

        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-sm text-text-secondary">עמוד {data.meta.page} מתוך {data.meta.totalPages}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>הקודם</Button>
              <Button variant="ghost" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage(p => p + 1)}>הבא</Button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
