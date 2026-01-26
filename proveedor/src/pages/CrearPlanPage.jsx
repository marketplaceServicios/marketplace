import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { FormField } from '@/components/forms/FormField'
import { FormTextarea } from '@/components/forms/FormTextarea'
import { FormSelect } from '@/components/forms/FormSelect'
import { DynamicFieldList } from '@/components/shared/DynamicFieldList'
import { PhotoGallery } from '@/components/shared/PhotoGallery'
import { usePlanesStore } from '@/store/planesStore'
import { useCategoriasStore } from '@/store/categoriasStore'
import { Save, ArrowLeft } from 'lucide-react'

export function CrearPlanPage() {
  const navigate = useNavigate()
  const addPlan = usePlanesStore((state) => state.addPlan)
  const categorias = useCategoriasStore((state) => state.categorias)

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    valor: '',
    categoria: ''
  })

  const [detalles, setDetalles] = useState([
    { title: '', description: '' }
  ])

  const [fotos, setFotos] = useState([])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCategoriaChange = (value) => {
    setFormData({
      ...formData,
      categoria: value
    })
  }

  const handleAddDetalle = (detalle) => {
    setDetalles([...detalles, detalle])
  }

  const handleRemoveDetalle = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index))
  }

  const handleAddFoto = (foto) => {
    setFotos([...fotos, foto])
  }

  const handleRemoveFoto = (index) => {
    setFotos(fotos.filter((_, i) => i !== index))
  }

  const handleSelectPrincipalFoto = (index) => {
    setFotos(fotos.map((foto, i) => ({
      ...foto,
      isPrincipal: i === index
    })))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newPlan = {
      ...formData,
      valor: parseInt(formData.valor) || 0,
      detalles,
      imagen: fotos.find(f => f.isPrincipal)?.url || fotos[0]?.url || '',
      isPrincipal: false,
      isOferta: false
    }

    addPlan(newPlan)
    navigate('/planes')
  }

  const categoriaOptions = categorias.map((cat) => ({
    value: cat.nombre,
    label: cat.nombre
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crea un nuevo plan"
        subtitle="Configura los detalles de tu servicio"
        action={
          <Button variant="ghost" onClick={() => navigate('/planes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <FormField
                  label="Titulo del plan"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Tour Cartagena Premium"
                  required
                />

                <FormTextarea
                  label="Descripcion amplia"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe tu plan en detalle..."
                  variant="highlight"
                  rows={5}
                  required
                />
              </CardContent>
            </Card>

            {/* Dynamic Fields */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-4">
                  Detalles del plan
                </h3>
                <DynamicFieldList
                  fields={detalles}
                  onChange={setDetalles}
                  onAdd={handleAddDetalle}
                  onRemove={handleRemoveDetalle}
                />
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-4">
                  Galeria de fotos
                </h3>
                <PhotoGallery
                  photos={fotos}
                  onAdd={handleAddFoto}
                  onRemove={handleRemoveFoto}
                  onSelectPrincipal={handleSelectPrincipalFoto}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-ivory/50 rounded-lg">
                  <FormField
                    label="Valor del plan"
                    name="valor"
                    type="number"
                    value={formData.valor}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                  <p className="text-xs text-slate mt-1">
                    Precio en pesos colombianos (COP)
                  </p>
                </div>

                <FormSelect
                  label="Categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleCategoriaChange}
                  options={categoriaOptions}
                  placeholder="Selecciona una categoria"
                  required
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Crear y guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
