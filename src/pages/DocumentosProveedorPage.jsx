import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { DocumentCard } from '@/components/shared/DocumentCard'
import { Button } from '@/components/ui/button'
import { useEmpresasStore } from '@/store/empresasStore'

export function DocumentosProveedorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEmpresaById } = useEmpresasStore()

  const empresa = getEmpresaById(id)

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Empresa no encontrada</p>
        <Button
          variant="outline"
          onClick={() => navigate('/empresas-por-servicios')}
          className="mt-4"
        >
          Volver al listado
        </Button>
      </div>
    )
  }

  const handleDownload = (documento) => {
    alert(`Descargando: ${documento.nombre}`)
  }

  return (
    <div>
      <PageHeader title="Documentos proveedor" />

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {empresa.documentos.map((doc) => (
          <DocumentCard
            key={doc.id}
            title={doc.nombre}
            onDownload={() => handleDownload(doc)}
          />
        ))}
      </div>

      {/* Back button */}
      <div className="mt-8">
        <Button
          variant="outline"
          onClick={() => navigate(`/proveedor/${id}`)}
        >
          Volver a informacion
        </Button>
      </div>
    </div>
  )
}
