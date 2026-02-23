import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useContactosStore } from '@/store/contactosStore'
import { Mail, Phone, MessageCircle, CheckCheck, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PREFERENCIA_ICON = {
  WhatsApp: <Smartphone className="h-3.5 w-3.5" />,
  Llamada: <Phone className="h-3.5 w-3.5" />,
  Email: <Mail className="h-3.5 w-3.5" />,
}

const FILTROS = [
  { value: 'todos', label: 'Todos' },
  { value: 'sin_leer', label: 'Sin leer' },
  { value: 'leidos', label: 'Leídos' },
]

export function MensajesPage() {
  const { contactos, fetchContactos, marcarLeido, loading } = useContactosStore()
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    fetchContactos()
  }, [])

  const contactosFiltrados = contactos.filter((c) => {
    if (filtro === 'sin_leer') return !c.leido
    if (filtro === 'leidos') return c.leido
    return true
  })

  const sinLeer = contactos.filter((c) => !c.leido).length

  return (
    <div>
      <PageHeader
        title="Mensajes de contacto"
        subtitle={
          sinLeer > 0
            ? `${sinLeer} mensaje${sinLeer !== 1 ? 's' : ''} sin leer`
            : 'Todos los mensajes leídos'
        }
      />

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === f.value
                ? 'bg-primary text-white'
                : 'bg-cream text-primary hover:bg-ivory'
            }`}
          >
            {f.label}
            {f.value === 'sin_leer' && sinLeer > 0 && (
              <span className="ml-2 bg-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {sinLeer}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {loading && (
          <div className="text-center py-12 text-muted">Cargando mensajes...</div>
        )}

        {!loading && contactosFiltrados.length === 0 && (
          <div className="text-center py-12 text-muted bg-white rounded-xl border border-cream">
            No hay mensajes {filtro === 'sin_leer' ? 'sin leer' : filtro === 'leidos' ? 'leídos' : ''}
          </div>
        )}

        {!loading && contactosFiltrados.map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col sm:flex-row gap-4 transition-colors ${
              c.leido ? 'border-cream' : 'border-accent/30 bg-accent/[0.02]'
            }`}
          >
            {/* Indicador no leído */}
            <div className="flex-shrink-0 pt-1">
              <div className={`w-2.5 h-2.5 rounded-full mt-1 ${c.leido ? 'bg-transparent' : 'bg-accent'}`} />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-primary">{c.nombre}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-sage" />
                      {c.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-sage" />
                      {c.celular}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-slate">{c.fecha}</span>
                  <span className="inline-flex items-center gap-1 text-xs bg-cream text-primary px-2.5 py-1 rounded-full">
                    {PREFERENCIA_ICON[c.preferencia]}
                    Prefiere {c.preferencia}
                  </span>
                </div>
              </div>

              {/* Mensaje */}
              <div className="bg-cream/50 rounded-lg px-4 py-3">
                <div className="flex items-center gap-1.5 text-xs text-slate mb-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Mensaje
                </div>
                <p className="text-sm text-primary whitespace-pre-wrap">{c.mensaje}</p>
              </div>

              {/* Acciones */}
              {!c.leido && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => marcarLeido(c.id)}
                    className="gap-1.5 text-sage border-sage/40 hover:bg-sage/10"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Marcar como leído
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
