import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Star, Tag, Pencil, EyeOff, Eye, Trash2, Check, X } from 'lucide-react'

export function PlanCard({
  image,
  title,
  description,
  category,
  valor,
  precioOriginal,
  activo = true,
  isPrincipal = false,
  isOferta = false,
  onSelectPrincipal,
  onSelectOferta,
  onEdit,
  onToggleActivo,
  onDelete
}) {
  const [showOfertaInput, setShowOfertaInput] = useState(false)
  const [precioOfertaInput, setPrecioOfertaInput] = useState('')
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <Card className={`overflow-hidden group transition-shadow duration-300 ${activo ? 'hover:shadow-lg' : 'opacity-60'}`}>
      <div className="relative">
        <img
          src={image}
          alt={title}
          className={`w-full h-48 object-cover ${!activo ? 'grayscale' : ''}`}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {!activo && (
            <Badge className="bg-gray-600 text-white flex items-center gap-1">
              <EyeOff className="h-3 w-3" />
              Inactivo
            </Badge>
          )}
          {activo && isPrincipal && (
            <Badge variant="warning" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Principal
            </Badge>
          )}
          {activo && isOferta && (
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
          <div className="mb-3">
            {precioOriginal && (
              <p className="text-xs text-slate/60 line-through leading-none mb-0.5">
                {formatPrice(precioOriginal)}
              </p>
            )}
            <p className="text-accent font-bold">{formatPrice(valor)}</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {onEdit && activo && (
            <Button variant="outline" size="sm" onClick={onEdit} className="w-full text-xs">
              <Pencil className="h-3 w-3 mr-1" />
              Editar plan
            </Button>
          )}
          {activo && (
            <>
              <Button
                variant={isPrincipal ? 'default' : 'outline'}
                size="sm"
                onClick={onSelectPrincipal}
                className="w-full text-xs"
              >
                <Star className="h-3 w-3 mr-1" />
                {isPrincipal ? 'Plan principal' : 'Seleccionar como plan principal'}
              </Button>
              {showOfertaInput ? (
                <div className="space-y-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-medium text-amber-800">Precio de oferta (COP)</p>
                  <Input
                    type="number"
                    value={precioOfertaInput}
                    onChange={(e) => setPrecioOfertaInput(e.target.value)}
                    placeholder={String(valor)}
                    className="h-8 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 text-xs h-7"
                      disabled={!precioOfertaInput || parseInt(precioOfertaInput) <= 0}
                      onClick={() => {
                        onSelectOferta(parseInt(precioOfertaInput))
                        setShowOfertaInput(false)
                        setPrecioOfertaInput('')
                      }}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Confirmar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => { setShowOfertaInput(false); setPrecioOfertaInput('') }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant={isOferta ? 'accent' : 'outline'}
                  size="sm"
                  onClick={() => isOferta ? onSelectOferta(null) : setShowOfertaInput(true)}
                  className="w-full text-xs"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {isOferta ? 'Quitar oferta' : 'Poner en oferta'}
                </Button>
              )}
            </>
          )}
          <div className="flex gap-2 pt-1 border-t border-cream">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleActivo}
              className={`flex-1 text-xs ${activo ? 'text-muted' : 'text-sage border-sage/40 hover:bg-sage/5'}`}
            >
              {activo ? <><EyeOff className="h-3 w-3 mr-1" />Desactivar</> : <><Eye className="h-3 w-3 mr-1" />Activar</>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm(`¿Eliminar el plan "${title}"? Esta acción no se puede deshacer.`))
                  onDelete()
              }}
              className="text-danger hover:text-danger/80 hover:bg-danger/5 text-xs"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
