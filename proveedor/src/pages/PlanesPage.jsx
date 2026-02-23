import { useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PlanCard } from '@/components/shared/PlanCard'
import { usePlanesStore } from '@/store/planesStore'
import { useCategoriasStore } from '@/store/categoriasStore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PlanesPage() {
  const navigate = useNavigate()
  const planes = usePlanesStore((state) => state.planes)
  const fetchPlanes = usePlanesStore((state) => state.fetchPlanes)
  const categorias = useCategoriasStore((state) => state.categorias)
  const fetchCategorias = useCategoriasStore((state) => state.fetchCategorias)
  const setPlanPrincipal = usePlanesStore((state) => state.setPlanPrincipal)
  const setPlanOferta = usePlanesStore((state) => state.setPlanOferta)
  const toggleActivo = usePlanesStore((state) => state.toggleActivo)
  const deletePlan = usePlanesStore((state) => state.deletePlan)

  useEffect(() => {
    fetchPlanes()
    fetchCategorias()
  }, [])

  const planesActivos = planes.filter(p => p.activo)
  const planesInactivos = planes.filter(p => !p.activo)

  // Group active plans by category
  const planesByCategoria = categorias.reduce((acc, categoria) => {
    const planesCategoria = planesActivos.filter(
      (plan) => plan.categoria === categoria.nombre
    )
    if (planesCategoria.length > 0) {
      acc[categoria.nombre] = planesCategoria
    }
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tus planes"
        subtitle="Publica experiencias claras y completas. Entre más información útil, más confianza y mejores cierres."
        action={
          <Button onClick={() => navigate('/crear-plan')}>
            <Plus className="h-4 w-4 mr-2" />
            Crear nuevo plan
          </Button>
        }
      />

      {/* Planes activos agrupados por categoría */}
      {Object.entries(planesByCategoria).length === 0 && planesInactivos.length === 0 ? (
        <div className="text-center py-12 text-slate">
          <p className="mb-4">No tienes planes creados</p>
          <Button onClick={() => navigate('/crear-plan')}>
            <Plus className="h-4 w-4 mr-2" />
            Crear tu primer plan
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(planesByCategoria).map(([categoria, planesCategoria]) => (
            <div key={categoria}>
              <h2 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-cream">
                {categoria}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {planesCategoria.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    image={plan.imagen}
                    title={plan.titulo}
                    description={plan.descripcion}
                    category={plan.categoria}
                    valor={plan.valor}
                    precioOriginal={plan.precioOriginal}
                    activo={plan.activo}
                    isPrincipal={plan.isPrincipal}
                    isOferta={plan.isOferta}
                    onSelectPrincipal={() => setPlanPrincipal(plan.id)}
                    onSelectOferta={(precio) => setPlanOferta(plan.id, precio)}
                    onEdit={() => navigate(`/editar-plan/${plan.id}`)}
                    onToggleActivo={() => toggleActivo(plan.id)}
                    onDelete={() => deletePlan(plan.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Planes inactivos */}
          {planesInactivos.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-muted mb-4 pb-2 border-b border-cream flex items-center gap-2">
                Inactivos
                <span className="text-sm font-normal bg-cream px-2 py-0.5 rounded-full">
                  {planesInactivos.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {planesInactivos.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    image={plan.imagen}
                    title={plan.titulo}
                    description={plan.descripcion}
                    category={plan.categoria}
                    valor={plan.valor}
                    activo={false}
                    isPrincipal={false}
                    isOferta={false}
                    onToggleActivo={() => toggleActivo(plan.id)}
                    onDelete={() => deletePlan(plan.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
