import { useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { CategoryCard } from '@/components/shared/CategoryCard'
import { useCategoriasStore } from '@/store/categoriasStore'

export function CategoriasPage() {
  const categorias = useCategoriasStore((state) => state.categorias)
  const loading = useCategoriasStore((state) => state.loading)
  const fetchCategorias = useCategoriasStore((state) => state.fetchCategorias)

  useEffect(() => { fetchCategorias() }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías"
        subtitle="Categorías definidas por el administrador. Úsalas para organizar tus planes."
      />

      {loading && (
        <div className="text-center py-12 text-slate">Cargando...</div>
      )}

      {!loading && categorias.length === 0 && (
        <div className="text-center py-12 text-slate bg-white rounded-xl border border-cream">
          No hay categorías disponibles por el momento.
        </div>
      )}

      {!loading && categorias.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categorias.map((categoria) => (
            <CategoryCard
              key={categoria.id}
              image={categoria.imagen}
              nombre={categoria.nombre}
              descripcion={categoria.descripcion}
            />
          ))}
        </div>
      )}
    </div>
  )
}
