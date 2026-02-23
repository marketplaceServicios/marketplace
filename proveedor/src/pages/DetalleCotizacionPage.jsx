import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { useCotizacionesStore } from '@/store/cotizacionesStore'
import {
  ArrowLeft,
  User,
  FileText,
  Phone,
  Mail,
  CheckCircle,
  RotateCcw,
  StickyNote,
  Save,
  Clock
} from 'lucide-react'

export function DetalleCotizacionPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [notas, setNotas] = useState('')
  const [guardandoNotas, setGuardandoNotas] = useState(false)
  const [notasGuardadas, setNotasGuardadas] = useState(false)
  const [toggling, setToggling] = useState(false)

  const cotizaciones = useCotizacionesStore((state) => state.cotizaciones)
  const fetchCotizaciones = useCotizacionesStore((state) => state.fetchCotizaciones)
  const getCotizacionById = useCotizacionesStore((state) => state.getCotizacionById)
  const toggleEstado = useCotizacionesStore((state) => state.toggleEstado)
  const guardarNotas = useCotizacionesStore((state) => state.guardarNotas)

  useEffect(() => {
    if (cotizaciones.length === 0) fetchCotizaciones()
  }, [])

  const cotizacion = getCotizacionById(id)

  // notas state is always for the new note — intentionally starts empty

  if (!cotizacion) {
    return (
      <div className="text-center py-12">
        <p className="text-slate mb-4">Cotización no encontrada</p>
        <Button onClick={() => navigate('/cotizaciones')}>
          Volver a cotizaciones
        </Button>
      </div>
    )
  }

  const handleToggleEstado = async () => {
    setToggling(true)
    try {
      await toggleEstado(cotizacion.id)
    } catch (err) {
      console.error('Error al cambiar estado:', err)
    } finally {
      setToggling(false)
    }
  }

  const handleGuardarNotas = async () => {
    if (!notas.trim()) return
    setGuardandoNotas(true)
    try {
      await guardarNotas(cotizacion.id, notas.trim())
      setNotas('')
      setNotasGuardadas(true)
      setTimeout(() => setNotasGuardadas(false), 2000)
    } catch (err) {
      console.error('Error al guardar notas:', err)
    } finally {
      setGuardandoNotas(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Solicitud de Cotización #${cotizacion.id}`}
        subtitle={cotizacion.plan}
        action={
          <Button variant="ghost" onClick={() => navigate('/cotizaciones')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={cotizacion.imagen}
                  alt={cotizacion.plan}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <Badge variant="sage" className="mb-2">
                    {cotizacion.categoria}
                  </Badge>
                  <h2 className="text-xl font-semibold text-primary">
                    {cotizacion.plan}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 bg-cream/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-sage mt-0.5" />
                  <div>
                    <p className="text-xs text-slate">Quien solicita</p>
                    <p className="font-medium text-primary">
                      {cotizacion.cliente}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-sage mt-0.5" />
                  <div>
                    <p className="text-xs text-slate">Requerimientos adicionales</p>
                    <p className="font-medium text-primary">
                      {cotizacion.requerimientos}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notas internas */}
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-primary mb-3 flex items-center gap-1.5">
                <StickyNote className="h-4 w-4" />
                Notas internas
                <span className="text-xs font-normal text-slate">(Solo visibles para ti)</span>
              </p>

              {/* Historial de notas */}
              {cotizacion.notas.length > 0 && (
                <div className="space-y-2 mb-4 max-h-52 overflow-y-auto pr-1">
                  {[...cotizacion.notas].reverse().map((nota, i) => (
                    <div key={i} className="bg-cream/50 rounded-lg p-3 border border-cream">
                      <div className="flex items-center gap-1 text-xs text-slate mb-1">
                        <Clock className="h-3 w-3" />
                        {nota.fecha}
                      </div>
                      <p className="text-sm text-primary whitespace-pre-wrap">{nota.texto}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Nueva nota */}
              <textarea
                className="w-full border border-cream rounded-lg p-3 text-sm text-primary bg-ivory/30 focus:outline-none focus:ring-2 focus:ring-sage/30 resize-none"
                rows={3}
                placeholder="Escribe una nueva nota interna..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              />
              <div className="flex items-center justify-end mt-3 gap-2">
                {notasGuardadas && (
                  <span className="text-xs text-sage flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Nota guardada
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGuardarNotas}
                  disabled={guardandoNotas || !notas.trim()}
                  className="gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  {guardandoNotas ? 'Guardando...' : 'Guardar nota'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Toggle estado */}
          <div className="flex gap-3">
            <Button
              onClick={handleToggleEstado}
              className="flex-1"
              size="lg"
              variant={cotizacion.resuelta ? 'outline' : 'default'}
              disabled={toggling}
            >
              {cotizacion.resuelta ? (
                <><RotateCcw className="h-4 w-4 mr-2" />Marcar como pendiente</>
              ) : (
                <><CheckCircle className="h-4 w-4 mr-2" />Marcar como respondida</>
              )}
            </Button>
          </div>
        </div>

        {/* Contact Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sage/10 rounded-lg">
                  <Phone className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="text-xs text-slate">Teléfono</p>
                  <p className="font-medium text-primary">
                    {cotizacion.telefono}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-slate">Correo</p>
                  <p className="font-medium text-primary">
                    {cotizacion.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-slate space-y-1">
            <p>Creada: {cotizacion.fechaCreacion}</p>
            {cotizacion.fechaRespuesta && (
              <p className={cotizacion.resuelta ? 'text-sage' : 'text-amber-600'}>
                {cotizacion.resuelta ? 'Respondida el:' : 'Pendiente desde el:'} {cotizacion.fechaRespuesta}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
