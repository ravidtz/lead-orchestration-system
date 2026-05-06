import { PageShell, PageHeader } from '@/components/layout/page-shell'
import dynamic from 'next/dynamic'
const EmptyState = dynamic(() => import('@/components/shared/empty-state').then(m => m.EmptyState), { loading: () => null })

export default function VoicePage() {
  return (
    <PageShell>
      <PageHeader title="שיחות קול" subtitle="יומן שיחות קוליות" />
      <EmptyState
        title="אין שיחות קוליות עדיין"
        description="שיחות קוליות יופיעו כאן לאחר הגדרת Twilio"
      />
    </PageShell>
  )
}
