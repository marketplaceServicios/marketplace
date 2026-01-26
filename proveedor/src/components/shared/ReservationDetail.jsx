import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Users,
  DollarSign,
  Lock,
  Package
} from 'lucide-react'

const colorVariants = {
  teal: 'bg-teal-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500'
}

export function ReservationDetail({
  fecha,
  servicio,
  horario,
  cliente,
  direccion,
  cantidadPersonas,
  valorPagado,
  otrosItems = [],
  color = 'teal',
  onBloquearFecha
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const options = { day: 'numeric', month: 'long' }
    return date.toLocaleDateString('es-CO', options)
  }

  if (!fecha) {
    return (
      <Card className="bg-cream/30">
        <CardContent className="p-6 text-center text-slate">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Selecciona una fecha para ver los detalles de la reserva</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${colorVariants[color] || colorVariants.teal}`} />
            <CardTitle className="text-xl">{formatDate(fecha)}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-cream/30 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-sage" />
            <div>
              <p className="text-xs text-slate">Servicio</p>
              <p className="font-medium text-primary">{servicio}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-sage" />
            <div>
              <p className="text-xs text-slate">Horario</p>
              <p className="font-medium text-primary">{horario}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-sage" />
            <div>
              <p className="text-xs text-slate">Quien contrata</p>
              <p className="font-medium text-primary">{cliente}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-sage" />
            <div>
              <p className="text-xs text-slate">Direccion</p>
              <p className="font-medium text-primary">{direccion}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-sage" />
            <div>
              <p className="text-xs text-slate">Cantidad de personas</p>
              <p className="font-medium text-primary">{cantidadPersonas}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-sage" />
            <div>
              <p className="text-xs text-slate">Valor pagado</p>
              <p className="font-medium text-accent">{formatPrice(valorPagado)}</p>
            </div>
          </div>

          {otrosItems.length > 0 && (
            <div>
              <p className="text-xs text-slate mb-2">Otros items</p>
              <div className="flex flex-wrap gap-2">
                {otrosItems.map((item, index) => (
                  <Badge key={index} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={onBloquearFecha}
        >
          <Lock className="h-4 w-4 mr-2" />
          Bloquear fecha
        </Button>
      </CardContent>
    </Card>
  )
}
