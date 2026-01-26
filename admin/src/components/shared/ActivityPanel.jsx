import { cn } from '@/lib/utils'

export function ActivityPanel({
  title = "Tu actividad",
  items,
  className
}) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-cream p-4 sm:p-6 shadow-sm",
      className
    )}>
      <h3 className="font-bold text-primary mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="font-bold text-primary min-w-[30px]">
              {item.value}
            </span>
            <span className="text-sm text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
