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
  const categorias = useCategoriasStore((state) => state.categorias)
  const setPlanPrincipal = usePlanesStore((state) => state.setPlanPrincipal)
  const setPlanOferta = usePlanesStore((state) => state.setPlanOferta)

  // Group plans by category
  const planesByCategoria = categorias.reduce((acc, categoria) => {
    const planesCategoria = planes.filter(
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

      {Object.entries(planesByCategoria).length === 0 ? (
        <div className="text-center py-12 text-slate">
          <p className="mb-4">No tienes planes activos</p>
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
                    isPrincipal={plan.isPrincipal}
                    isOferta={plan.isOferta}
                    onSelectPrincipal={() => setPlanPrincipal(plan.id)}
                    onSelectOferta={() => setPlanOferta(plan.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
