import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  subtitle,
  action,
  actionLabel,
  actionVariant = 'default',
  className
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-6 sm:mb-8", className)}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">{title}</h1>
        {subtitle && (
          <p className="text-muted mt-1 text-sm sm:text-base">{subtitle}</p>
        )}
      </div>
      {action && actionLabel && (
        <Button variant={actionVariant} onClick={action} className="w-full sm:w-auto">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
