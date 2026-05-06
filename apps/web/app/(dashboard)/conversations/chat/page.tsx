import { PageShell, PageHeader } from '@/components/layout/page-shell'
import dynamic from 'next/dynamic'
const EmptyState = dynamic(() => import('@/components/shared/empty-state').then(m => m.EmptyState), { loading: () => null })

export default function ChatPage() {
  return (
    <PageShell>
      <PageHeader title="שיחות צ׳אט" subtitle="שיחות AI עם לידים ולקוחות" />
      <EmptyState
        title="לא נבחרה שיחה"
        description="בחר ליד או לקוח כדי להתחיל שיחת AI"
      />
    </PageShell>
  )
}
