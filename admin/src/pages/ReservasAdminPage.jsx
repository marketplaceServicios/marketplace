import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import {
  User, Users, Mail, Phone, PhoneCall, CreditCard,
  Calendar, Package, DollarSign, ChevronDown, ChevronUp, Hash
} from 'lucide-react'

const ESTADO_COLORS = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
  completada: 'bg-blue-100 text-blue-800',
}

const DOC_LABELS = {
  cc: 'C.C.',
  ce: 'C.E.',
  passport: 'Pasaporte',
  ti: 'T.I.',
}

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

const calcAge = (birthDate) => {
  if (!birthDate) return null
  const [y, m, d] = birthDate.split('-').map(Number)
  const today = new Date()
  let age = today.getFullYear() - y
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--
  return age
}

const formatDate = (iso) => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('T')[0].split('-').map(Number)
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}T12:00:00Z`))
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
      <div>
        <span className="text-xs text-muted">{label}: </span>
        <span className="text-sm text-primary font-medium">{value}</span>
      </div>
    </div>
  )
}

function ReservaRow({ reserva }) {
  const [open, setOpen] = useState(false)
  const df = reserva.datosFacturacion || {}
  const turistas = Array.isArray(reserva.turistas) ? reserva.turistas : []

  const docDisplay = (type, number) => {
    const label = DOC_LABELS[type] || type || ''
    return label && number ? `${label} ${number}` : number || null
  }

  const phoneDisplay = df.countryCode && df.phone ? `${df.countryCode} ${df.phone}` : df.phone || null

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Row header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 bg-white hover:bg-muted/20 text-left transition-colors"
      >
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
          <div>
            <span className="font-mono text-xs bg-primary/8 text-primary px-2 py-0.5 rounded">
              {reserva.codigo}
            </span>
          </div>
          <div className="text-sm text-stormy">
            <span className="font-medium text-primary">{df.name || reserva.usuario?.nombre || '—'}</span>
          </div>
          <div className="text-sm text-stormy truncate">
            {reserva.plan?.titulo || '—'}
            <span className="ml-1 text-xs text-muted">· {reserva.plan?.proveedor?.nombreEmpresa || ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_COLORS[reserva.estado] || 'bg-gray-100 text-gray-700'}`}>
              {reserva.estado}
            </span>
            <span className="text-sm font-semibold text-green-700 ml-auto">{formatCOP(Number(reserva.total))}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-muted">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 pt-1 bg-muted/10 border-t grid md:grid-cols-2 gap-6">

          {/* Resumen */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Reserva</p>
            <InfoRow icon={Package} label="Plan" value={reserva.plan?.titulo} />
            <InfoRow icon={Hash} label="Proveedor" value={reserva.plan?.proveedor?.nombreEmpresa} />
            {df.selectedDate && (
              <InfoRow icon={Calendar} label="Fecha del plan" value={formatDate(df.selectedDate)} />
            )}
            <InfoRow icon={Calendar} label="Fecha de creación" value={formatDate(reserva.createdAt)} />
            <InfoRow icon={Users} label="Personas" value={String(reserva.numPersonas)} />
            {df.cobrarIva ? (
              <div className="pl-6 space-y-0.5">
                <div className="flex justify-between text-xs text-muted">
                  <span>Subtotal</span>
                  <span>{formatCOP(Number(reserva.subtotal))}</span>
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>IVA ({df.porcentajeIva ?? 19}%)</span>
                  <span>{formatCOP(Number(reserva.impuestos))}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-primary">
                  <span>Total</span>
                  <span>{formatCOP(Number(reserva.total))}</span>
                </div>
              </div>
            ) : (
              <InfoRow icon={DollarSign} label="Total" value={formatCOP(Number(reserva.total))} />
            )}
          </div>

          {/* Contacto */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Información de contacto</p>
            <InfoRow icon={User} label="Nombre" value={df.name} />
            <InfoRow icon={CreditCard} label="Identificación" value={docDisplay(df.documentType, df.documentNumber)} />
            <InfoRow icon={Mail} label="Correo" value={df.email} />
            <InfoRow icon={Phone} label="Celular" value={phoneDisplay} />
            <InfoRow icon={PhoneCall} label="Contacto alterno" value={df.alternateContact} />
            <InfoRow icon={Hash} label="Dirección" value={df.address} />
            <InfoRow icon={Hash} label="Ciudad" value={df.city} />
            {df.specialNeeds && (
              <div className="mt-1 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-700 mb-1">Necesidades especiales</p>
                <p className="text-sm text-amber-900">{df.specialNeeds}</p>
              </div>
            )}
          </div>

          {/* Turistas */}
          {turistas.length > 0 && (
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
                Datos de turistas ({turistas.length})
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {turistas.map((t, i) => (
                  <div key={i} className="bg-white border rounded-lg p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-primary mb-1">Turista {i + 1}</p>
                    <InfoRow icon={User} label="Nombre" value={t.name} />
                    <InfoRow icon={CreditCard} label="Documento" value={docDisplay(t.documentType, t.documentNumber)} />
                    {t.birthDate && (
                      <InfoRow icon={Calendar} label="Nacimiento"
                        value={`${new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${t.birthDate}T12:00:00Z`))} · ${calcAge(t.birthDate)} años`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ESTADOS = ['todos', 'pendiente', 'confirmada', 'cancelada', 'completada']

export function ReservasAdminPage() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    api.get('/admin/reservas')
      .then(setReservas)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtradas = reservas.filter((r) => {
    const matchEstado = filtroEstado === 'todos' || r.estado === filtroEstado
    const q = busqueda.toLowerCase()
    const df = r.datosFacturacion || {}
    const matchBusqueda = !q ||
      r.codigo?.toLowerCase().includes(q) ||
      (df.name || '').toLowerCase().includes(q) ||
      (df.email || '').toLowerCase().includes(q) ||
      (r.plan?.titulo || '').toLowerCase().includes(q) ||
      (r.plan?.proveedor?.nombreEmpresa || '').toLowerCase().includes(q)
    return matchEstado && matchBusqueda
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted">Cargando reservas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-primary">Reservas activas</h1>
        <p className="text-muted mt-1 text-sm">Todas las reservas de la plataforma. Haz clic en una fila para ver el detalle completo.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por código, cliente, plan o proveedor…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 min-w-[220px] h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex gap-1 flex-wrap">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setFiltroEstado(e)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                filtroEstado === e
                  ? 'bg-primary text-white'
                  : 'bg-muted/30 text-stormy hover:bg-muted/60'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-muted">{filtradas.length} reserva{filtradas.length !== 1 ? 's' : ''}</p>

      {/* List */}
      {filtradas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted text-sm">
            No hay reservas que coincidan con los filtros.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtradas.map((r) => (
            <ReservaRow key={r.id} reserva={r} />
          ))}
        </div>
      )}
    </div>
  )
}
