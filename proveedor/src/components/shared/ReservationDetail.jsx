import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  User,
  Users,
  DollarSign,
  Lock,
  Package,
  Phone,
  Mail,
  Hash,
  PhoneCall,
  CreditCard,
} from 'lucide-react'

const colorVariants = {
  teal: 'bg-teal-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
}

const DOC_LABELS = {
  cc: 'C.C.',
  ce: 'C.E.',
  passport: 'Pasaporte',
  ti: 'T.I.',
}

const ESTADO_COLORS = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
  completada: 'bg-blue-100 text-blue-800',
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-sage flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-slate">{label}</p>
        <p className="font-medium text-primary text-sm break-words">{value}</p>
      </div>
    </div>
  )
}

export function ReservationDetail({
  fecha,
  servicio,
  codigo,
  cantidadPersonas,
  valorPagado,
  estado,
  color = 'teal',
  turistas = [],
  datosFacturacion = {},
  onBloquearFecha,
}) {
  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
  }

  const calcAge = (birthDate) => {
    if (!birthDate) return null
    const [y, m, d] = birthDate.split('-').map(Number)
    const today = new Date()
    let age = today.getFullYear() - y
    if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--
    return age
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

  const docType = DOC_LABELS[datosFacturacion.documentType] || datosFacturacion.documentType || ''
  const docDisplay = docType && datosFacturacion.documentNumber
    ? `${docType} ${datosFacturacion.documentNumber}`
    : datosFacturacion.documentNumber || null

  const phoneDisplay = datosFacturacion.countryCode && datosFacturacion.phone
    ? `${datosFacturacion.countryCode} ${datosFacturacion.phone}`
    : datosFacturacion.phone || null

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${colorVariants[color] || colorVariants.teal}`} />
            <CardTitle className="text-base capitalize">{formatDate(fecha)}</CardTitle>
          </div>
          {estado && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_COLORS[estado] || 'bg-gray-100 text-gray-700'}`}>
              {estado}
            </span>
          )}
        </div>
        {codigo && (
          <p className="text-xs text-slate mt-1">
            Código: <span className="font-mono font-semibold text-primary">{codigo}</span>
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4 overflow-y-auto max-h-[70vh]">

        {/* Plan y totales */}
        <div className="p-3 bg-cream/40 rounded-lg space-y-2.5">
          <InfoRow icon={Package} label="Plan" value={servicio} />
          <InfoRow icon={Users} label="Personas" value={String(cantidadPersonas)} />
          {datosFacturacion.cobrarIva ? (
            <div className="pt-1 space-y-1 border-t border-cream/60">
              <div className="flex justify-between text-xs text-slate">
                <span>Subtotal</span>
                <span>{formatPrice(valorPagado / (1 + (datosFacturacion.porcentajeIva ?? 19) / 100))}</span>
              </div>
              <div className="flex justify-between text-xs text-slate">
                <span>IVA ({datosFacturacion.porcentajeIva ?? 19}%)</span>
                <span>{formatPrice(valorPagado - valorPagado / (1 + (datosFacturacion.porcentajeIva ?? 19) / 100))}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-primary">
                <span>Total pagado</span>
                <span>{formatPrice(valorPagado)}</span>
              </div>
            </div>
          ) : (
            <InfoRow icon={DollarSign} label="Total pagado"
              value={valorPagado ? formatPrice(valorPagado) : null} />
          )}
        </div>

        {/* Información de contacto */}
        <div>
          <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">
            Información de contacto
          </p>
          <div className="p-3 bg-cream/40 rounded-lg space-y-2.5">
            <InfoRow icon={User} label="Nombre" value={datosFacturacion.name} />
            <InfoRow icon={CreditCard} label="Identificación" value={docDisplay} />
            <InfoRow icon={Mail} label="Correo" value={datosFacturacion.email} />
            <InfoRow icon={Phone} label="Celular" value={phoneDisplay} />
            <InfoRow icon={PhoneCall} label="Contacto alterno" value={datosFacturacion.alternateContact} />
            <InfoRow icon={Hash} label="Dirección" value={datosFacturacion.address} />
            <InfoRow icon={Hash} label="Ciudad" value={datosFacturacion.city} />
            {datosFacturacion.specialNeeds && (
              <div className="mt-1 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-700 mb-1">Necesidades especiales</p>
                <p className="text-sm text-amber-900">{datosFacturacion.specialNeeds}</p>
              </div>
            )}
          </div>
        </div>

        {/* Datos de turistas */}
        {turistas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">
              Turistas ({turistas.length})
            </p>
            <div className="space-y-2">
              {turistas.map((t, i) => {
                const tDoc = DOC_LABELS[t.documentType] || t.documentType || ''
                const tDocDisplay = tDoc && t.documentNumber ? `${tDoc} ${t.documentNumber}` : t.documentNumber || null
                return (
                  <div key={i} className="p-3 bg-cream/40 rounded-lg space-y-1.5">
                    <p className="text-xs font-semibold text-primary">Turista {i + 1}</p>
                    <InfoRow icon={User} label="Nombre" value={t.name} />
                    <InfoRow icon={CreditCard} label="Documento" value={tDocDisplay} />
                    {t.birthDate && (
                      <InfoRow icon={Calendar} label="Nacimiento"
                        value={`${new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${t.birthDate}T12:00:00Z`))} · ${calcAge(t.birthDate)} años`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full" onClick={onBloquearFecha}>
          <Lock className="h-4 w-4 mr-2" />
          Bloquear fecha
        </Button>
      </CardContent>
    </Card>
  )
}
