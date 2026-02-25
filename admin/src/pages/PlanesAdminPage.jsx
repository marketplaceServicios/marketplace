import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Eye, ToggleLeft, ToggleRight, Star, Award, AlertTriangle } from 'lucide-react'
import { api } from '@/lib/api'

const MAX_POPULARES = 3

export function PlanesAdminPage() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [popularError, setPopularError] = useState('')

  useEffect(() => {
    api.get('/admin/planes')
      .then(data => setPlanes(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggleActivo = async (plan) => {
    try {
      await api.patch(`/admin/planes/${plan.id}/toggle`)
      setPlanes(prev => prev.map(p => p.id === plan.id ? { ...p, activo: !p.activo } : p))
    } catch (err) {
      console.error('Error al cambiar estado:', err)
    }
  }

  const toggleDestacado = async (plan) => {
    setPopularError('')
    try {
      await api.patch(`/admin/planes/${plan.id}/destacado`)
      setPlanes(prev => prev.map(p => p.id === plan.id ? { ...p, destacado: !p.destacado } : p))
    } catch (err) {
      const msg = err.message || 'Error al cambiar destacado'
      setPopularError(msg)
      console.error(msg)
    }
  }

  const toggleOferta = async (plan) => {
    try {
      await api.patch(`/admin/planes/${plan.id}/oferta`)
      // Solo uno puede ser esOferta a la vez: limpiar todos y marcar el elegido
      setPlanes(prev => prev.map(p => ({
        ...p,
        esOferta: p.id === plan.id ? !plan.esOferta : (plan.esOferta ? p.esOferta : false)
      })))
    } catch (err) {
      console.error('Error al cambiar oferta:', err)
    }
  }

  const filtros = ['todos', 'activos', 'inactivos']

  const planesFiltrados = planes.filter(p => {
    if (filtro === 'activos') return p.activo
    if (filtro === 'inactivos') return !p.activo
    return true
  })

  const getBadge = (activo) => activo
    ? 'bg-sage/20 text-sage'
    : 'bg-red-100 text-red-600'

  const popularCount = planes.filter(p => p.destacado).length
  const ofertaActual = planes.find(p => p.esOferta)

  return (
    <div>
      <PageHeader
        title="Planes"
        subtitle="Revisa consistencia, claridad y experiencia Silver-friendly antes de publicar."
      />

      {/* Info de selección web */}
      <div className="flex flex-wrap gap-3 mb-2">
        <div className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${
          popularCount >= MAX_POPULARES
            ? 'bg-golden/20 border-golden/50'
            : 'bg-golden/10 border-golden/30'
        }`}>
          <Star className="h-4 w-4 text-golden fill-golden flex-shrink-0" />
          <span className="text-primary font-medium">
            {popularCount} / {MAX_POPULARES} planes populares seleccionados
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg text-sm">
          <Award className="h-4 w-4 text-accent flex-shrink-0" />
          <span className="text-primary font-medium">
            {ofertaActual ? `"${ofertaActual.titulo}"` : 'Ningún plan'} como destacado de la semana
          </span>
        </div>
      </div>

      {popularError && (
        <div className="flex items-start gap-2 mb-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          {popularError}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {filtros.map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filtro === f ? 'bg-primary text-white' : 'bg-cream text-primary hover:bg-ivory'
            }`}
          >
            {f === 'todos' ? 'Todos' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted">Cargando planes...</div>
      ) : (
        <div className="bg-white rounded-xl border border-cream shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Proveedor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Categoría</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Precio</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Web</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {planesFiltrados.map(plan => (
                  <tr key={plan.id} className="border-b border-cream last:border-0">
                    <td className="py-3 px-4 text-sm font-medium text-primary">{plan.titulo}</td>
                    <td className="py-3 px-4 text-sm text-muted">{plan.proveedor?.nombreEmpresa || '—'}</td>
                    <td className="py-3 px-4 text-sm text-muted">{plan.categoria?.nombre || '—'}</td>
                    <td className="py-3 px-4 text-sm text-muted">${Number(plan.precio).toLocaleString('es-CO')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadge(plan.activo)}`}>
                        {plan.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button
                          title={
                            plan.destacado
                              ? 'Quitar de Planes populares'
                              : popularCount >= MAX_POPULARES
                                ? `Límite alcanzado (máx. ${MAX_POPULARES}). Quita uno antes de agregar otro.`
                                : 'Agregar a Planes populares'
                          }
                          onClick={() => toggleDestacado(plan)}
                          disabled={!plan.destacado && popularCount >= MAX_POPULARES}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            plan.destacado
                              ? 'bg-golden/15 text-golden hover:bg-golden/25'
                              : 'hover:bg-cream text-gray-300 hover:text-golden'
                          }`}
                        >
                          <Star size={16} className={plan.destacado ? 'fill-golden' : ''} />
                        </button>
                        <button
                          title={plan.esOferta ? 'Quitar como plan destacado de la semana' : 'Marcar como plan destacado de la semana'}
                          onClick={() => toggleOferta(plan)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            plan.esOferta
                              ? 'bg-accent/15 text-accent hover:bg-accent/25'
                              : 'hover:bg-cream text-gray-300 hover:text-accent'
                          }`}
                        >
                          <Award size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          className="p-1.5 rounded-lg hover:bg-cream text-muted"
                          title="Ver en la web"
                          onClick={() => window.open(`https://proveedor.vivesilver.com/planes/${plan.id}`, '_blank')}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`p-1.5 rounded-lg ${plan.activo ? 'hover:bg-red-50 text-red-500' : 'hover:bg-sage/10 text-sage'}`}
                          title={plan.activo ? 'Desactivar' : 'Activar'}
                          onClick={() => toggleActivo(plan)}
                        >
                          {plan.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {planesFiltrados.map(plan => (
              <div key={plan.id} className="border border-cream rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-primary">{plan.titulo}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadge(plan.activo)}`}>
                    {plan.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="text-sm text-muted mb-1">{plan.proveedor?.nombreEmpresa || '—'}</p>
                <p className="text-sm text-muted mb-3">{plan.categoria?.nombre || '—'} · ${Number(plan.precio).toLocaleString('es-CO')}</p>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => toggleDestacado(plan)}
                    disabled={!plan.destacado && popularCount >= MAX_POPULARES}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      plan.destacado ? 'bg-golden/15 text-golden' : 'bg-cream text-muted'
                    }`}
                  >
                    <Star size={14} className={plan.destacado ? 'fill-golden' : ''} />
                    Popular
                  </button>
                  <button
                    onClick={() => toggleOferta(plan)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      plan.esOferta ? 'bg-accent/15 text-accent' : 'bg-cream text-muted'
                    }`}
                  >
                    <Award size={14} />
                    Destacado
                  </button>
                </div>
                <button
                  onClick={() => toggleActivo(plan)}
                  className={`w-full py-2 px-3 rounded-lg text-sm font-medium ${
                    plan.activo ? 'bg-red-50 text-red-600' : 'bg-sage/10 text-sage'
                  }`}
                >
                  {plan.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            ))}
          </div>

          {planesFiltrados.length === 0 && !loading && (
            <div className="text-center py-12 text-muted">
              No hay planes con este filtro
            </div>
          )}
        </div>
      )}

      {/* Leyenda */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <Star size={12} className="text-golden fill-golden" />
          Aparece en "Planes populares" (máx. 3 visibles)
        </span>
        <span className="flex items-center gap-1.5">
          <Award size={12} className="text-accent" />
          Aparece como "Plan destacado de la semana" (solo uno)
        </span>
      </div>
    </div>
  )
}
