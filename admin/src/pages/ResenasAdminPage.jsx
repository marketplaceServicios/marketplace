import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useResenasStore } from '@/store/resenasStore'
import { Star, Check, X, CheckCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FILTROS = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'aprobado', label: 'Aprobadas' },
]

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

const ESTADO_BADGE = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  aprobado: 'bg-green-100 text-green-800',
}

export function ResenasAdminPage() {
  const { resenas, counts, loading, fetchResenas, aprobar, rechazar, batchAprobar, batchRechazar } = useResenasStore()
  const [filtro, setFiltro] = useState('todos')
  const [selected, setSelected] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    fetchResenas()
  }, [])

  const filtered = resenas.filter((r) => {
    if (filtro === 'todos') return true
    return r.estado === filtro
  })

  const allSelected = filtered.length > 0 && selected.length === filtered.length
  const someSelected = selected.length > 0

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelected([])
    } else {
      setSelected(filtered.map((r) => r.id))
    }
  }

  const handleAprobar = async (id) => {
    try {
      await aprobar(id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleRechazar = async (id) => {
    try {
      await rechazar(id)
      setConfirmDelete(null)
      setSelected((prev) => prev.filter((s) => s !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleBatchAprobar = async () => {
    try {
      await batchAprobar(selected)
      setSelected([])
    } catch (err) {
      console.error(err)
    }
  }

  const handleBatchRechazar = async () => {
    if (!window.confirm(`¿Eliminar permanentemente ${selected.length} reseña(s)?`)) return
    try {
      await batchRechazar(selected)
      setSelected([])
    } catch (err) {
      console.error(err)
    }
  }

  const pendienteCount = counts.pendiente || 0

  return (
    <div>
      <PageHeader
        title="Reseñas"
        subtitle={
          pendienteCount > 0
            ? `${pendienteCount} reseña${pendienteCount !== 1 ? 's' : ''} pendiente${pendienteCount !== 1 ? 's' : ''} de revisión`
            : 'Todas las reseñas revisadas'
        }
      />

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFiltro(f.value); setSelected([]) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === f.value
                ? 'bg-primary text-white'
                : 'bg-cream text-primary hover:bg-ivory'
            }`}
          >
            {f.label}
            {f.value === 'pendiente' && pendienteCount > 0 && (
              <span className="ml-2 bg-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pendienteCount}
              </span>
            )}
            {f.value === 'aprobado' && counts.aprobado > 0 && (
              <span className="ml-2 bg-sage/20 text-sage text-xs font-bold px-1.5 py-0.5 rounded-full">
                {counts.aprobado}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Batch actions bar */}
      {someSelected && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <span className="text-sm text-primary font-medium">
            {selected.length} seleccionada{selected.length !== 1 ? 's' : ''}
          </span>
          <Button
            size="sm"
            onClick={handleBatchAprobar}
            className="gap-1.5 bg-sage hover:bg-sage/90"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Aprobar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBatchRechazar}
            className="gap-1.5 text-danger border-danger/40 hover:bg-danger/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Rechazar
          </Button>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {loading && (
          <div className="text-center py-12 text-muted">Cargando reseñas...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted bg-white rounded-xl border border-cream">
            No hay reseñas {filtro === 'pendiente' ? 'pendientes' : filtro === 'aprobado' ? 'aprobadas' : ''}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="mb-2">
            <label className="flex items-center gap-2 text-sm text-slate cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Seleccionar todo
            </label>
          </div>
        )}

        {!loading && filtered.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-cream shadow-sm p-5 flex flex-col sm:flex-row gap-4"
          >
            {/* Checkbox */}
            <div className="flex-shrink-0 pt-1">
              <input
                type="checkbox"
                checked={selected.includes(r.id)}
                onChange={() => toggleSelect(r.id)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-primary">{r.nombre}</h3>
                  <p className="text-sm text-slate">{r.email}</p>
                  {r.plan && (
                    <p className="text-xs text-sage mt-1">Plan: {r.plan.titulo}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-slate">
                    {new Date(r.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ESTADO_BADGE[r.estado] || 'bg-gray-100 text-gray-600'}`}>
                    {r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StarDisplay rating={r.rating} />
                <span className="text-sm text-slate">{r.rating}/5</span>
              </div>

              <div className="bg-cream/50 rounded-lg px-4 py-3">
                <p className="text-sm text-primary">{r.comentario}</p>
              </div>

              {/* Acciones individuales */}
              {r.estado === 'pendiente' && (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAprobar(r.id)}
                    className="gap-1.5 bg-sage hover:bg-sage/90"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Aprobar
                  </Button>

                  {confirmDelete === r.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-danger">¿Eliminar permanentemente?</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRechazar(r.id)}
                        className="gap-1 text-danger border-danger/40 hover:bg-danger/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Sí, eliminar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmDelete(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDelete(r.id)}
                      className="gap-1.5 text-danger border-danger/40 hover:bg-danger/10"
                    >
                      <X className="h-3.5 w-3.5" />
                      Rechazar
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
