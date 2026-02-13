import { useParams, useNavigate } from 'react-router-dom'
import {
  Building2,
  Briefcase,
  FileText,
  MapPin,
  Phone,
  Smartphone,
  Mail,
  CheckCircle,
  PauseCircle,
  MessageSquare,
  Clock,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InfoRow } from '@/components/shared/InfoRow'
import { useEmpresasStore } from '@/store/empresasStore'

export function InfoProveedorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEmpresaById } = useEmpresasStore()

  const empresa = getEmpresaById(id)

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Empresa no encontrada</p>
        <Button
          variant="outline"
          onClick={() => navigate('/empresas-por-servicios')}
          className="mt-4"
        >
          Volver al listado
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">{empresa.nombre}</h1>
        <Button
          variant="default"
          onClick={() => navigate(`/proveedor/${id}/representante`)}
          className="w-full sm:w-auto"
        >
          Consultar representante legal
        </Button>
      </div>

      {/* Info Grid */}
      <div className="bg-white rounded-xl border border-cream p-4 sm:p-6 shadow-sm">
        <InfoRow
          icon={Building2}
          label="Nombre legal de la empresa:"
          value={empresa.nombreLegal}
        />
        <InfoRow
          icon={Briefcase}
          label="Tipo de servicio:"
          value={empresa.tipoServicio}
        />
        <InfoRow
          icon={FileText}
          label="NIT de la empresa:"
          value={empresa.nit}
        />
        <InfoRow
          icon={MapPin}
          label="Dirección"
          value={empresa.direccion}
        />
        <InfoRow
          icon={Phone}
          label="Teléfono fijo"
          value={empresa.telefonoFijo}
        />
        <InfoRow
          icon={Smartphone}
          label="Celular"
          value={empresa.celular}
        />
        <InfoRow
          icon={Mail}
          label="Correo"
          value={empresa.correo}
        />
        <InfoRow
          icon={CheckCircle}
          label="Cantidad de planes activos"
          value={empresa.planesActivos}
        />
        <InfoRow
          icon={PauseCircle}
          label="Cantidad de planes pausados"
          value={empresa.planesPausados}
        />
        <InfoRow
          icon={MessageSquare}
          label="Cotizaciones resueltas"
          value={empresa.cotizacionesResueltas}
        />
        <InfoRow
          icon={Clock}
          label="Cotizaciones pendientes"
          value={empresa.cotizacionesPendientes}
        />
        <InfoRow
          icon={Calendar}
          label="Reservas concretadas"
          value={empresa.reservasConcretadas}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-6">
        <Button
          variant="default"
          onClick={() => navigate(`/proveedor/${id}/documentos`)}
        >
          Ver documentación
        </Button>
      </div>
    </div>
  )
}
