import { useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { CotizacionCard } from '@/components/shared/CotizacionCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCotizacionesStore } from '@/store/cotizacionesStore'
import { useCategoriasStore } from '@/store/categoriasStore'
import { useNavigate } from 'react-router-dom'

export function CotizacionesPage() {
  const navigate = useNavigate()

  const categorias = useCategoriasStore((state) => state.categorias)
  const fetchCategorias = useCategoriasStore((state) => state.fetchCategorias)
  const fetchCotizaciones = useCotizacionesStore((state) => state.fetchCotizaciones)

  useEffect(() => {
    fetchCotizaciones()
    fetchCategorias()
  }, [])

  const filtroCategoria = useCotizacionesStore((state) => state.filtroCategoria)
  const setFiltroCategoria = useCotizacionesStore((state) => state.setFiltroCategoria)
  const getCotizacionesFiltradas = useCotizacionesStore((state) => state.getCotizacionesFiltradas)

  const cotizaciones = getCotizacionesFiltradas()

  const tabs = [
    { value: 'todas', label: 'Todas' },
    ...categorias.slice(0, 4).map((cat) => ({
      value: cat.nombre,
      label: cat.nombre
    }))
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cotizaciones pendientes"
        subtitle="Responde con claridad. Ofrece 2–3 opciones simples para facilitar la decisión de la familia."
      />

      <Tabs value={filtroCategoria} onValueChange={setFiltroCategoria} className="w-full">
        <TabsList className="flex-wrap h-auto gap-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {cotizaciones.length === 0 ? (
        <div className="text-center py-12 text-slate">
          <p>No hay cotizaciones pendientes</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cotizaciones.map((cotizacion) => (
            <CotizacionCard
              key={cotizacion.id}
              image={cotizacion.imagen}
              plan={cotizacion.plan}
              cliente={cotizacion.cliente}
              categoria={cotizacion.categoria}
              fechaCreacion={cotizacion.fechaCreacion}
              onView={() => navigate(`/cotizaciones/${cotizacion.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
