import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export function InfoRow({
  icon: Icon = FileText,
  label,
  value,
  className
}) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4 border-b border-cream last:border-b-0",
      className
    )}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-medium text-primary sm:min-w-[200px]">{label}</span>
      </div>
      <span className="text-sm text-muted ml-13 sm:ml-0">{value != null && value !== '' ? value : '—'}</span>
    </div>
  )
}
