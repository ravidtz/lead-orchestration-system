import { PageShell, PageHeader } from '@/components/layout/page-shell'
import { EmptyState } from '@/components/shared/empty-state'

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
