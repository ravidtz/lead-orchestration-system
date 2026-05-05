import { PageShell, PageHeader } from '@/components/layout/page-shell'
import { EmptyState } from '@/components/shared/empty-state'

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
