import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function CompanyCard({
  avatar,
  name,
  onViewInfo,
  onDeactivate,
  className
}) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-xl border border-cream shadow-sm hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="flex items-center gap-4 flex-1">
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-sage text-white">{initials}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-primary">{name}</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onViewInfo}
          className="text-xs whitespace-nowrap"
        >
          Ampliar informacion
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDeactivate}
          className="text-xs whitespace-nowrap border-slate/30 text-slate hover:bg-slate/10"
        >
          Desactivar proveedor
        </Button>
      </div>
    </div>
  )
}
