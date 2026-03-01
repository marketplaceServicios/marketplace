import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Building2, Briefcase, FileText, MapPin, Phone,
  Smartphone, Mail, CheckCircle, PauseCircle,
  MessageSquare, Clock, Calendar, ShieldOff, ShieldCheck, Trash2,
  KeyRound, Copy, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InfoRow } from '@/components/shared/InfoRow'
import { useEmpresasStore } from '@/store/empresasStore'

export function InfoProveedorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEmpresaById, fetchEmpresaById, toggleEmpresaActiva, deleteEmpresa, resetPasswordProveedor } = useEmpresasStore()
  const [empresa, setEmpresa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [tempPassword, setTempPassword] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const local = getEmpresaById(id)
    if (local) {
      setEmpresa(local)
      setLoading(false)
    }
    // Siempre recarga desde API para tener stats actualizadas
    fetchEmpresaById(id).then(data => {
      if (data) setEmpresa(data)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return <div className="text-center py-12 text-muted">Cargando...</div>
  }

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Empresa no encontrada</p>
        <Button variant="outline" onClick={() => navigate('/empresas-por-servicios')} className="mt-4">
          Volver al listado
        </Button>
      </div>
    )
  }

  const handleToggle = async () => {
    setActionError('')
    try {
      await toggleEmpresaActiva(parseInt(id))
      setEmpresa(prev => ({ ...prev, activa: !prev.activa }))
    } catch {
      setActionError('No se pudo cambiar el estado. Intenta de nuevo.')
    }
  }

  const handleResetPassword = async () => {
    if (!confirm(`¿Restablecer la contraseña de "${empresa.nombre}"? Se generará una contraseña temporal que deberás compartir con el proveedor.`)) return
    setActionError('')
    setResetLoading(true)
    try {
      const temp = await resetPasswordProveedor(parseInt(id))
      setTempPassword(temp)
      setCopied(false)
    } catch {
      setActionError('No se pudo restablecer la contraseña. Intenta de nuevo.')
    } finally {
      setResetLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar permanentemente a "${empresa.nombre}"? Esta acción eliminará también todos sus planes, categorías y equipo. No se puede deshacer.`)) return
    setActionError('')
    try {
      await deleteEmpresa(parseInt(id))
      navigate('/empresas-por-servicios')
    } catch {
      setActionError('No se pudo eliminar el proveedor. Intenta de nuevo.')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">{empresa.nombre}</h1>
          <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            empresa.activa ? 'bg-sage/15 text-sage' : 'bg-red-100 text-red-600'
          }`}>
            {empresa.activa ? 'Activo' : 'Suspendido'}
          </span>
        </div>
        <Button variant="default" onClick={() => navigate(`/proveedor/${id}/representante`)} className="w-full sm:w-auto">
          Consultar representante legal
        </Button>
      </div>

      {actionError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Modal contraseña temporal */}
      {tempPassword && (
        <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-semibold">
            <KeyRound className="h-4 w-4" />
            Contraseña temporal generada
          </div>
          <p className="text-sm text-amber-700">
            Comparte esta contraseña con el proveedor (WhatsApp, teléfono, etc.). Al iniciar sesión deberá cambiarla.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-4 py-2.5 bg-white border border-amber-300 rounded-lg font-mono text-lg tracking-widest text-primary text-center select-all">
              {tempPassword}
            </code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-amber-300 bg-white text-sm text-amber-700 hover:bg-amber-100 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <button
            onClick={() => setTempPassword(null)}
            className="text-xs text-amber-600 hover:underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-cream p-4 sm:p-6 shadow-sm">
        <InfoRow icon={Building2} label="Nombre legal de la empresa:" value={empresa.nombreLegal || '—'} />
        <InfoRow icon={Briefcase} label="Tipo de servicio:" value={empresa.tipoServicio || '—'} />
        <InfoRow icon={FileText} label="NIT de la empresa:" value={empresa.nit || '—'} />
        <InfoRow icon={MapPin} label="Dirección" value={empresa.direccion || '—'} />
        <InfoRow icon={Phone} label="Teléfono fijo" value={empresa.telefonoFijo || '—'} />
        <InfoRow icon={Smartphone} label="Celular" value={empresa.celular || '—'} />
        <InfoRow icon={Mail} label="Correo" value={empresa.correo} />
        <InfoRow icon={CheckCircle} label="Cantidad de planes activos" value={empresa.planesActivos} />
        <InfoRow icon={PauseCircle} label="Cantidad de planes pausados" value={empresa.planesPausados} />
        <InfoRow icon={MessageSquare} label="Cotizaciones resueltas" value={empresa.cotizacionesResueltas} />
        <InfoRow icon={Clock} label="Cotizaciones pendientes" value={empresa.cotizacionesPendientes} />
        <InfoRow icon={Calendar} label="Reservas concretadas" value={empresa.reservasConcretadas} />
      </div>

      <div className="flex flex-wrap justify-between gap-3 mt-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleToggle}
            className={empresa.activa
              ? 'border-amber-300 text-amber-700 hover:bg-amber-50 gap-1.5'
              : 'border-sage/40 text-sage hover:bg-sage/10 gap-1.5'
            }
          >
            {empresa.activa
              ? <><ShieldOff className="h-4 w-4" />Suspender proveedor</>
              : <><ShieldCheck className="h-4 w-4" />Reactivar proveedor</>
            }
          </Button>
          <Button
            variant="outline"
            onClick={handleResetPassword}
            disabled={resetLoading}
            className="border-primary/30 text-primary hover:bg-primary/5 gap-1.5"
          >
            <KeyRound className="h-4 w-4" />
            {resetLoading ? 'Generando...' : 'Restablecer contraseña'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar proveedor
          </Button>
        </div>
        <Button variant="default" onClick={() => navigate(`/proveedor/${id}/documentos`)}>
          Ver documentación
        </Button>
      </div>
    </div>
  )
}
