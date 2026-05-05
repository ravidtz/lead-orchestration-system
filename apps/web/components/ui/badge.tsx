import { cn } from '@/lib/utils'

type BadgeColor = 'blue' | 'green' | 'red' | 'yellow' | 'orange' | 'purple' | 'gray'

interface BadgeProps {
  label: string
  color?: BadgeColor
  className?: string
}

const colorMap: Record<BadgeColor, string> = {
  blue:   'bg-blue-500/15 text-blue-400',
  green:  'bg-green-500/15 text-green-400',
  red:    'bg-red-500/15 text-red-400',
  yellow: 'bg-yellow-500/15 text-yellow-400',
  orange: 'bg-orange-500/15 text-orange-400',
  purple: 'bg-purple-500/15 text-purple-400',
  gray:   'bg-white/10 text-text-secondary',
}

export function Badge({ label, color = 'gray', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorMap[color],
      className,
    )}>
      {label}
    </span>
  )
}
