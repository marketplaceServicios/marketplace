import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Tag } from 'lucide-react'

export function PlanCard({
  image,
  title,
  description,
  category,
  valor,
  isPrincipal = false,
  isOferta = false,
  onSelectPrincipal,
  onSelectOferta,
  onEdit
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {isPrincipal && (
            <Badge variant="warning" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Principal
            </Badge>
          )}
          {isOferta && (
            <Badge variant="accent" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Oferta
            </Badge>
          )}
        </div>
        {category && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary">{category}</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-primary mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-slate mb-2 line-clamp-2">{description}</p>
        )}
        {valor && (
          <p className="text-accent font-bold mb-3">{formatPrice(valor)}</p>
        )}
        <div className="flex flex-col gap-2">
          <Button
            variant={isPrincipal ? 'default' : 'outline'}
            size="sm"
            onClick={onSelectPrincipal}
            className="w-full text-xs"
          >
            <Star className="h-3 w-3 mr-1" />
            {isPrincipal ? 'Plan principal' : 'Seleccionar como plan principal'}
          </Button>
          <Button
            variant={isOferta ? 'accent' : 'outline'}
            size="sm"
            onClick={onSelectOferta}
            className="w-full text-xs"
          >
            <Tag className="h-3 w-3 mr-1" />
            {isOferta ? 'En oferta' : 'Seleccionar como plan en oferta'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
