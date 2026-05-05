import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface EmptyStateProps {
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
        <div className="w-8 h-1 bg-border rounded-full" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-text-secondary mb-6 max-w-sm">{description}</p>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
