import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useCotizacionesAdminStore } from '@/store/cotizacionesAdminStore'
import { useEmpresasStore } from '@/store/empresasStore'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  User, Phone, Mail, FileText, StickyNote, Clock, Building2, Tag
} from 'lucide-react'

const ESTADOS = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'respondida', label: 'Respondidas' },
]

function EstadoBadge({ estado }) {
  const styles = {
    pendiente: 'bg-amber-100 text-amber-700',
    respondida: 'bg-sage/15 text-sage',
    cerrada: 'bg-slate/15 text-slate',
  }
  const labels = { pendiente: 'Pendiente', respondida: 'Respondida', cerrada: 'Cerrada' }
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${styles[estado] || 'bg-cream text-primary'}`}>
      {labels[estado] || estado}
    </span>
  )
}

function CotizacionRow({ c }) {
  const [notasExpanded, setNotasExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-cream shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
      {/* Imagen del plan */}
      <div className="flex-shrink-0">
        {c.imagen ? (
          <img
            src={c.imagen}
            alt={c.plan}
            className="w-20 h-20 rounded-lg object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-cream flex items-center justify-center">
            <FileText className="h-8 w-8 text-slate/40" />
          </div>
        )}
      </div>

      {/* Info principal */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Plan + proveedor + categoria + estado */}
        <div className="flex flex-wrap items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary truncate">{c.plan}</h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                <Building2 className="h-3 w-3" />{c.proveedor}
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-cream text-slate px-2 py-0.5 rounded-full">
                <Tag className="h-3 w-3" />{c.categoria}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <EstadoBadge estado={c.estado} />
            <span className="text-xs text-slate">Creada: {c.fechaCreacion}</span>
            {c.fechaRespuesta && (
              <span className={`text-xs ${c.resuelta ? 'text-sage' : 'text-amber-600'}`}>
                {c.resuelta ? 'Respondida el:' : 'Pendiente desde el:'} {c.fechaRespuesta}
              </span>
            )}
          </div>
        </div>

        {/* Datos del cliente */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5 text-slate">
            <User className="h-3.5 w-3.5 text-sage" />
            {c.cliente}
          </span>
          <span className="flex items-center gap-1.5 text-slate">
            <Mail className="h-3.5 w-3.5 text-sage" />
            {c.email}
          </span>
          <span className="flex items-center gap-1.5 text-slate">
            <Phone className="h-3.5 w-3.5 text-sage" />
            {c.telefono}
          </span>
        </div>

        {/* Requerimientos */}
        {c.requerimientos !== '—' && (
          <div className="text-sm text-primary bg-cream/40 rounded-lg px-3 py-2">
            <span className="text-xs text-slate block mb-0.5">Requerimientos</span>
            {c.requerimientos}
          </div>
        )}

        {/* Notas internas */}
        {c.notas.length > 0 && (
          <div>
            <button
              onClick={() => setNotasExpanded(!notasExpanded)}
              className="flex items-center gap-1.5 text-xs text-slate hover:text-primary transition-colors"
            >
              <StickyNote className="h-3.5 w-3.5" />
              {c.notas.length} nota{c.notas.length !== 1 ? 's' : ''} interna{c.notas.length !== 1 ? 's' : ''}
              <span className="text-[10px]">{notasExpanded ? '▲' : '▼'}</span>
            </button>
            {notasExpanded && (
              <div className="mt-2 space-y-1.5">
                {[...c.notas].reverse().map((nota, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-1 text-xs text-slate mb-0.5">
                      <Clock className="h-3 w-3" />
                      {nota.fecha}
                    </div>
                    <p className="text-primary whitespace-pre-wrap">{nota.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function CotizacionesAdminPage() {
  const { cotizaciones, fetchCotizaciones, loading } = useCotizacionesAdminStore()
  const { empresas, fetchEmpresas } = useEmpresasStore()

  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroProveedor, setFiltroProveedor] = useState('todos')

  useEffect(() => {
    fetchEmpresas()
    fetchCotizaciones()
  }, [])

  const cotizacionesFiltradas = cotizaciones.filter((c) => {
    const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado
    const matchProveedor = filtroProveedor === 'todos' || c.proveedorId === parseInt(filtroProveedor)
    return matchEstado && matchProveedor
  })

  return (
    <div>
      <PageHeader
        title="Cotizaciones"
        subtitle="Todas las solicitudes de cotización recibidas en la plataforma."
      />

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={filtroProveedor}
          onValueChange={setFiltroProveedor}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Todos los proveedores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los proveedores</SelectItem>
            {empresas.map((e) => (
              <SelectItem key={e.id} value={String(e.id)}>
                {e.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 flex-wrap">
          {ESTADOS.map((f) => (
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
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {loading && (
          <div className="text-center py-12 text-muted">Cargando cotizaciones...</div>
        )}

        {!loading && cotizacionesFiltradas.length === 0 && (
          <div className="text-center py-12 text-muted bg-white rounded-xl border border-cream">
            No hay cotizaciones con los filtros seleccionados
          </div>
        )}

        {!loading && cotizacionesFiltradas.map((c) => (
          <CotizacionRow key={c.id} c={c} />
        ))}
      </div>
    </div>
  )
}
