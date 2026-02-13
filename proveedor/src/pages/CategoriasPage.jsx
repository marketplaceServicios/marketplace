import { PageHeader } from '@/components/layout/PageHeader'
import { CategoryCard } from '@/components/shared/CategoryCard'
import { useCategoriasStore } from '@/store/categoriasStore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function CategoriasPage() {
  const navigate = useNavigate()
  const categorias = useCategoriasStore((state) => state.categorias)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Todas tus categorías"
        subtitle="Organiza tus planes por categorías"
        action={
          <Button onClick={() => navigate('/crear-categoria')}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva categoría
          </Button>
        }
      />

      {categorias.length === 0 ? (
        <div className="text-center py-12 text-slate">
          <p className="mb-4">No tienes categorías creadas</p>
          <Button onClick={() => navigate('/crear-categoria')}>
            <Plus className="h-4 w-4 mr-2" />
            Crear tu primera categoría
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categorias.map((categoria) => (
            <CategoryCard
              key={categoria.id}
              image={categoria.imagen}
              nombre={categoria.nombre}
              descripcion={categoria.descripcion}
              onClick={() => navigate(`/crear-categoria?id=${categoria.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
