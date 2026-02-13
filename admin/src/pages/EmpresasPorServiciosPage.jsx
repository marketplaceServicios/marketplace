import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { CompanyCard } from '@/components/shared/CompanyCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useEmpresasStore } from '@/store/empresasStore'
import { useServiciosStore } from '@/store/serviciosStore'

export function EmpresasPorServiciosPage() {
  const navigate = useNavigate()
  const { filtroServicio, setFiltroServicio, getEmpresasFiltradas } = useEmpresasStore()
  const { servicios } = useServiciosStore()

  const empresasFiltradas = getEmpresasFiltradas()

  const handleViewInfo = (empresa) => {
    navigate(`/proveedor/${empresa.id}`)
  }

  const handleDeactivate = (empresa) => {
    alert(`Desactivar proveedor: ${empresa.nombre}`)
  }

  return (
    <div>
      <PageHeader title="Proveedores" subtitle="Asegura estándares: documentación, accesibilidad, políticas y contenido real." />

      {/* Filter */}
      <div className="mb-6">
        <Select
          value={filtroServicio || 'all'}
          onValueChange={(value) => setFiltroServicio(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Escoge un servicio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los servicios</SelectItem>
            {servicios.map((servicio) => (
              <SelectItem key={servicio.id} value={servicio.nombre}>
                {servicio.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Companies List */}
      <div className="space-y-3 sm:space-y-4">
        {empresasFiltradas.map((empresa) => (
          <CompanyCard
            key={empresa.id}
            avatar={empresa.avatar}
            name={empresa.nombre}
            onViewInfo={() => handleViewInfo(empresa)}
            onDeactivate={() => handleDeactivate(empresa)}
          />
        ))}

        {empresasFiltradas.length === 0 && (
          <div className="text-center py-12 text-muted bg-white rounded-xl border border-cream">
            No se encontraron empresas con los filtros seleccionados
          </div>
        )}
      </div>
    </div>
  )
}
