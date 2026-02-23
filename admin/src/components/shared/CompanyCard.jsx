import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ShieldOff, ShieldCheck, Trash2 } from 'lucide-react'

export function CompanyCard({
  avatar,
  name,
  isActive = true,
  onViewInfo,
  onToggleActive,
  onDelete,
  className
}) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleDelete = () => {
    if (confirm(`¿Eliminar permanentemente a "${name}"? Esta acción eliminará también todos sus planes, categorías y equipo. No se puede deshacer.`)) {
      onDelete?.()
    }
  }

  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200",
      isActive ? "border-cream" : "border-red-200 bg-red-50/30",
      className
    )}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className={cn("text-white", isActive ? "bg-sage" : "bg-slate/50")}>
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isActive && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" title="Suspendido" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-primary truncate">{name}</h3>
          <span className={cn(
            "inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5",
            isActive ? "bg-sage/15 text-sage" : "bg-red-100 text-red-600"
          )}>
            {isActive ? "Activo" : "Suspendido"}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 flex-shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={onViewInfo}
          className="text-xs whitespace-nowrap"
        >
          Ver información
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleActive}
          className={cn(
            "text-xs whitespace-nowrap gap-1.5",
            isActive
              ? "border-amber-300 text-amber-700 hover:bg-amber-50"
              : "border-sage/40 text-sage hover:bg-sage/10"
          )}
        >
          {isActive
            ? <><ShieldOff className="h-3.5 w-3.5" />Suspender</>
            : <><ShieldCheck className="h-3.5 w-3.5" />Reactivar</>
          }
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-xs whitespace-nowrap gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Eliminar
        </Button>
      </div>
    </div>
  )
}
