import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User, FileText, CreditCard, MapPin, Phone, Smartphone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InfoRow } from '@/components/shared/InfoRow'
import { useEmpresasStore } from '@/store/empresasStore'

export function InfoRepresentantePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEmpresaById, fetchEmpresaById } = useEmpresasStore()
  const [empresa, setEmpresa] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const local = getEmpresaById(id)
    if (local) setEmpresa(local)

    fetchEmpresaById(id).then(data => {
      if (data) setEmpresa(data)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return <div className="text-center py-12 text-muted">Cargando...</div>
  }

  const representante = empresa?.representante

  if (!empresa || !representante) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">
          {!empresa ? 'Empresa no encontrada' : 'Este proveedor no tiene representante legal registrado'}
        </p>
        <Button variant="outline" onClick={() => navigate(`/proveedor/${id}`)} className="mt-4">
          Volver a la empresa
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">{empresa.nombre}</h1>
        <Button variant="default" onClick={() => navigate(`/proveedor/${id}`)} className="w-full sm:w-auto">
          Consultar informacion de la empresa
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-cream p-4 sm:p-6 shadow-sm">
        <InfoRow icon={User} label="Nombre del representante legal" value={representante.nombre} />
        <InfoRow icon={FileText} label="Tipo de documento:" value={representante.tipoDocumento} />
        <InfoRow icon={CreditCard} label="Número de documento:" value={representante.documento} />
        <InfoRow icon={MapPin} label="Direccion" value={representante.direccion} />
        <InfoRow icon={Phone} label="Telefono fijo" value={representante.telefonoFijo} />
        <InfoRow icon={Smartphone} label="Celular" value={representante.celular} />
        <InfoRow icon={Mail} label="Correo" value={representante.correo} />
      </div>

      <div className="flex justify-end mt-6">
        <Button variant="default" onClick={() => navigate(`/proveedor/${id}/documentos`)} className="w-full sm:w-auto">
          Ver documentacion
        </Button>
      </div>
    </div>
  )
}
