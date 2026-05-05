'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { cn } from '@/lib/utils'

const icons = {
  success: <CheckCircle size={16} className="text-success" />,
  error: <XCircle size={16} className="text-danger" />,
  info: <Info size={16} className="text-accent" />,
  warning: <AlertTriangle size={16} className="text-warning" />,
}

export function Toaster() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'flex items-center gap-3 p-4 bg-surface border border-border rounded-xl shadow-modal text-sm',
            )}
          >
            {icons[toast.type]}
            <span className="flex-1 text-text-primary">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="text-text-disabled hover:text-text-secondary">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
