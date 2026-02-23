import { useEffect, useState } from 'react'
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
  const {
    filtroServicio, setFiltroServicio, getEmpresasFiltradas,
    fetchEmpresas, loading, toggleEmpresaActiva, deleteEmpresa
  } = useEmpresasStore()
  const { servicios } = useServiciosStore()
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [actionError, setActionError] = useState('')

  useEffect(() => { fetchEmpresas() }, [])

  const empresasFiltradas = getEmpresasFiltradas().filter(e => {
    if (filtroEstado === 'activos') return e.activa
    if (filtroEstado === 'suspendidos') return !e.activa
    return true
  })

  const handleToggleActiva = async (empresa) => {
    setActionError('')
    try {
      await toggleEmpresaActiva(empresa.id)
    } catch {
      setActionError(`No se pudo cambiar el estado de "${empresa.nombre}".`)
    }
  }

  const handleDelete = async (empresa) => {
    setActionError('')
    try {
      await deleteEmpresa(empresa.id)
    } catch {
      setActionError(`No se pudo eliminar a "${empresa.nombre}". Intenta de nuevo.`)
    }
  }

  return (
    <div>
      <PageHeader title="Proveedores" subtitle="Asegura estándares: documentación, accesibilidad, políticas y contenido real." />

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={filtroServicio || 'all'}
          onValueChange={(value) => setFiltroServicio(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Tipo de servicio" />
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

        <div className="flex gap-2">
          {['todos', 'activos', 'suspendidos'].map(f => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filtroEstado === f ? 'bg-primary text-white' : 'bg-cream text-primary hover:bg-ivory'
              }`}
            >
              {f === 'todos' ? 'Todos' : f === 'activos' ? 'Activos' : 'Suspendidos'}
            </button>
          ))}
        </div>
      </div>

      {actionError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3 sm:space-y-4">
        {loading && (
          <div className="text-center py-12 text-muted">Cargando proveedores...</div>
        )}
        {!loading && empresasFiltradas.map((empresa) => (
          <CompanyCard
            key={empresa.id}
            avatar={empresa.avatar}
            name={empresa.nombre}
            isActive={empresa.activa}
            onViewInfo={() => navigate(`/proveedor/${empresa.id}`)}
            onToggleActive={() => handleToggleActiva(empresa)}
            onDelete={() => handleDelete(empresa)}
          />
        ))}

        {!loading && empresasFiltradas.length === 0 && (
          <div className="text-center py-12 text-muted bg-white rounded-xl border border-cream">
            No se encontraron proveedores con los filtros seleccionados
          </div>
        )}
      </div>
    </div>
  )
}
