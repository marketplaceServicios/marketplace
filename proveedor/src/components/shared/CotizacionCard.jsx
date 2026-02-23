import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Eye, Tag } from 'lucide-react'

export function CotizacionCard({
  image,
  plan,
  cliente,
  categoria,
  fechaCreacion,
  resuelta = false,
  onView
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={image}
          alt={plan}
          className="w-full h-36 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="sage">{categoria}</Badge>
        </div>
        {resuelta && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-white/90 text-sage border-sage/40 text-xs">
              Respondida
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-primary mb-0.5 truncate">{plan}</h3>
        <p className="text-sm text-slate mb-3 truncate">{cliente}</p>

        <div className="space-y-1 text-xs text-slate mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>Creada: {fechaCreacion}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-3 w-3 flex-shrink-0" />
            <span>Categoría: {categoria}</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onView}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver
        </Button>
      </CardContent>
    </Card>
  )
}
