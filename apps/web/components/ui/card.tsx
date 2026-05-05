import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: ReactNode
  title?: string
  action?: ReactNode
}

export function Card({ className, children, title, action }: CardProps) {
  return (
    <div className={cn('bg-surface border border-border rounded-xl', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          {title && <h3 className="font-semibold text-text-primary">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
