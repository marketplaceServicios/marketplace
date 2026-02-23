import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { DocumentCard } from '@/components/shared/DocumentCard'
import { Button } from '@/components/ui/button'
import { useEmpresasStore } from '@/store/empresasStore'

export function DocumentosProveedorPage() {
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

  const documentos = empresa.documentos || []

  return (
    <div>
      <PageHeader title="Documentos proveedor" />

      {documentos.length === 0 ? (
        <div className="text-center py-12 text-muted bg-white rounded-xl border border-cream">
          Este proveedor aún no ha subido documentos
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {documentos.map((doc) => (
            <DocumentCard
              key={doc.id}
              title={doc.nombre}
              onDownload={() => window.open(doc.url, '_blank')}
            />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Button variant="outline" onClick={() => navigate(`/proveedor/${id}`)}>
          Volver a información
        </Button>
      </div>
    </div>
  )
}
