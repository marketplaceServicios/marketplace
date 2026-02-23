import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { CotizacionCard } from '@/components/shared/CotizacionCard'
import { useCotizacionesStore } from '@/store/cotizacionesStore'
import { useNavigate } from 'react-router-dom'

const FILTROS = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendientes', label: 'Pendientes' },
  { value: 'resueltas', label: 'Resueltas' },
]

export function TodasCotizacionesPage() {
  const navigate = useNavigate()
  const [filtroEstado, setFiltroEstado] = useState('todas')

  const cotizaciones = useCotizacionesStore((state) => state.cotizaciones)
  const fetchCotizaciones = useCotizacionesStore((state) => state.fetchCotizaciones)

  useEffect(() => {
    fetchCotizaciones()
  }, [])

  const cotizacionesFiltradas = cotizaciones.filter((c) => {
    if (filtroEstado === 'pendientes') return !c.resuelta
    if (filtroEstado === 'resueltas') return c.resuelta
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Todas las cotizaciones"
        subtitle="Historial completo de solicitudes recibidas."
      />

      <div className="flex gap-2 flex-wrap">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltroEstado(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroEstado === f.value
                ? 'bg-primary text-white'
                : 'bg-cream text-primary hover:bg-ivory'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {cotizacionesFiltradas.length === 0 ? (
        <div className="text-center py-12 text-slate">
          <p>No hay cotizaciones en esta categoría</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cotizacionesFiltradas.map((cotizacion) => (
            <CotizacionCard
              key={cotizacion.id}
              image={cotizacion.imagen}
              plan={cotizacion.plan}
              cliente={cotizacion.cliente}
              categoria={cotizacion.categoria}
              fechaCreacion={cotizacion.fechaCreacion}
              resuelta={cotizacion.resuelta}
              onView={() => navigate(`/cotizaciones/${cotizacion.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
