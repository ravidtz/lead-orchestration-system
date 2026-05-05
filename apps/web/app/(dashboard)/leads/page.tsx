'use client'
import { PageShell, PageHeader } from '@/components/layout/page-shell'
import { Button, TableSkeleton, Badge } from '@/components/ui'
import { EmptyState } from '@/components/shared/empty-state'
import { useLeads } from '@/hooks/use-leads'
import { LEAD_STATUSES, LEAD_PRIORITIES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function LeadsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useLeads({ page })

  const statusColor = (status: string) =>
    LEAD_STATUSES.find(s => s.value === status)?.color ?? 'gray'
  const statusLabel = (status: string) =>
    LEAD_STATUSES.find(s => s.value === status)?.label ?? status

  return (
    <PageShell>
      <PageHeader
        title="לידים"
        subtitle={data ? `${data.meta.total} לידים בסך הכל` : undefined}
        action={
          <Button>
            <Plus size={16} />
            ליד חדש
          </Button>
        }
      />

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-border text-xs font-medium uppercase tracking-wider text-text-disabled">
          <span>שם</span>
          <span>חברה / אימייל</span>
          <span>סטטוס</span>
          <span>עדיפות</span>
          <span>נוצר</span>
        </div>

        {isLoading && <TableSkeleton rows={8} cols={5} />}

        {!isLoading && data?.data.length === 0 && (
          <EmptyState title="אין לידים עדיין" description="צור ליד ראשון כדי להתחיל" />
        )}

        {data?.data.map(lead => (
          <Link
            key={lead.id}
            href={`/leads/${lead.id}`}
            className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-4 py-3.5 border-b border-border last:border-0 hover:bg-border/50 transition-colors items-center text-sm"
          >
            <span className="font-medium text-text-primary">
              {lead.firstName} {lead.lastName}
            </span>
            <span className="text-text-secondary">{lead.company ?? lead.email ?? '—'}</span>
            <Badge label={statusLabel(lead.status)} color={statusColor(lead.status) as any} />
            <span className="text-text-secondary capitalize">{lead.priority}</span>
            <span className="text-text-secondary">{formatDate(lead.createdAt)}</span>
          </Link>
        ))}

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-sm text-text-secondary">
              עמוד {data.meta.page} מתוך {data.meta.totalPages}
            </span>
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
