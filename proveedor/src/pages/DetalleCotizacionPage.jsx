import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { useCotizacionesStore } from '@/store/cotizacionesStore'
import {
  ArrowLeft,
  User,
  DollarSign,
  Calendar,
  FileText,
  Phone,
  Mail,
  CheckCircle,
  MessageCircle
} from 'lucide-react'

export function DetalleCotizacionPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const getCotizacionById = useCotizacionesStore(
    (state) => state.getCotizacionById
  )
  const marcarResuelta = useCotizacionesStore((state) => state.marcarResuelta)

  const cotizacion = getCotizacionById(id)

  if (!cotizacion) {
    return (
      <div className="text-center py-12">
        <p className="text-slate mb-4">Cotización no encontrada</p>
        <Button onClick={() => navigate('/cotizaciones')}>
          Volver a cotizaciones
        </Button>
      </div>
    )
  }

  const handleMarcarResuelta = () => {
    marcarResuelta(cotizacion.id)
    navigate('/cotizaciones')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Solicitud de Cotización #${cotizacion.id}`}
        subtitle={cotizacion.plan}
        action={
          <Button variant="ghost" onClick={() => navigate('/cotizaciones')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={cotizacion.imagen}
                  alt={cotizacion.plan}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <Badge variant="sage" className="mb-2">
                    {cotizacion.categoria}
                  </Badge>
                  <h2 className="text-xl font-semibold text-primary">
                    {cotizacion.plan}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 bg-cream/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-sage mt-0.5" />
                  <div>
                    <p className="text-xs text-slate">Quien solicita</p>
                    <p className="font-medium text-primary">
                      {cotizacion.cliente}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-sage mt-0.5" />
                  <div>
                    <p className="text-xs text-slate">Presupuesto</p>
                    <p className="font-medium text-primary">
                      {cotizacion.presupuesto}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-sage mt-0.5" />
                  <div>
                    <p className="text-xs text-slate">Fecha requerida</p>
                    <p className="font-medium text-primary">
                      {cotizacion.fechaRequerida}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-sage mt-0.5" />
                  <div>
                    <p className="text-xs text-slate">Requerimientos adicionales</p>
                    <p className="font-medium text-primary">
                      {cotizacion.requerimientos}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleMarcarResuelta}
              className="flex-1"
              size="lg"
              disabled={cotizacion.resuelta}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {cotizacion.resuelta ? 'Ya resuelta' : 'Marcar como resuelta'}
            </Button>
            <Button
              variant="outline"
              size="lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Solicitar info
            </Button>
          </div>
        </div>

        {/* Contact Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sage/10 rounded-lg">
                  <Phone className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="text-xs text-slate">Teléfono</p>
                  <p className="font-medium text-primary">
                    {cotizacion.telefono}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-slate">Correo</p>
                  <p className="font-medium text-primary">
                    {cotizacion.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-slate">
            <p>Creada: {cotizacion.fechaCreacion}</p>
            <p>Servicio: {cotizacion.fechaServicio}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
