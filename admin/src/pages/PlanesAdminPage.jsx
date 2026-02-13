import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Eye, Check, X, MessageSquare } from 'lucide-react'

const mockPlanes = [
  { id: 1, titulo: 'Tour Cartagena Premium', proveedor: 'Viajes Ejemplo', categoria: 'Viajes Silver', estado: 'pendiente', fecha: '2024-01-15' },
  { id: 2, titulo: 'Boda en Hacienda Bambusa', proveedor: 'Bodas Ejemplo', categoria: 'Bodas Silver', estado: 'aprobado', fecha: '2024-01-14' },
  { id: 3, titulo: 'Aniversario en Villa de Leyva', proveedor: 'Celebra Ejemplo', categoria: 'Celebraciones', estado: 'pendiente', fecha: '2024-01-13' },
  { id: 4, titulo: 'Fotografía profesional Silver', proveedor: 'Foto Studio', categoria: 'Servicios', estado: 'rechazado', fecha: '2024-01-12' },
]

export function PlanesAdminPage() {
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const estados = ['todos', 'pendiente', 'aprobado', 'rechazado']

  const planesFiltrados = filtroEstado === 'todos'
    ? mockPlanes
    : mockPlanes.filter(p => p.estado === filtroEstado)

  const getEstadoBadge = (estado) => {
    const styles = {
      pendiente: 'bg-warning/20 text-warning',
      aprobado: 'bg-sage/20 text-sage',
      rechazado: 'bg-danger/20 text-danger',
    }
    return styles[estado] || 'bg-cream text-muted'
  }

  return (
    <div>
      <PageHeader
        title="Planes"
        subtitle="Revisa consistencia, claridad y experiencia Silver-friendly antes de publicar."
      />

      <div className="flex gap-2 mb-6">
        {estados.map(estado => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filtroEstado === estado
                ? 'bg-primary text-white'
                : 'bg-cream text-primary hover:bg-ivory'
            }`}
          >
            {estado === 'todos' ? 'Todos' : estado}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-cream shadow-sm">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Proveedor</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Categoría</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Estado</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planesFiltrados.map(plan => (
                <tr key={plan.id} className="border-b border-cream last:border-0">
                  <td className="py-3 px-4 text-sm font-medium text-primary">{plan.titulo}</td>
                  <td className="py-3 px-4 text-sm text-muted">{plan.proveedor}</td>
                  <td className="py-3 px-4 text-sm text-muted">{plan.categoria}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getEstadoBadge(plan.estado)}`}>
                      {plan.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted">{plan.fecha}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-cream text-muted" title="Ver detalle">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-sage/10 text-sage" title="Aprobar">
                        <Check size={16} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-danger/10 text-danger" title="Rechazar">
                        <X size={16} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-cream text-muted" title="Solicitar cambios">
                        <MessageSquare size={16} />
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getEstadoBadge(plan.estado)}`}>
                  {plan.estado}
                </span>
              </div>
              <p className="text-sm text-muted mb-1">{plan.proveedor}</p>
              <p className="text-sm text-muted mb-3">{plan.categoria} · {plan.fecha}</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 rounded-lg bg-sage/10 text-sage text-sm font-medium">Aprobar</button>
                <button className="flex-1 py-2 px-3 rounded-lg bg-danger/10 text-danger text-sm font-medium">Rechazar</button>
              </div>
            </div>
          ))}
        </div>

        {planesFiltrados.length === 0 && (
          <div className="text-center py-12 text-muted">
            No hay planes con este filtro
          </div>
        )}
      </div>
    </div>
  )
}
