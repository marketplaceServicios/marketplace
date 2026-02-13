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
import { Save, ArrowLeft, Info } from 'lucide-react'

export function CrearPlanPage() {
  const navigate = useNavigate()
  const addPlan = usePlanesStore((state) => state.addPlan)
  const categorias = useCategoriasStore((state) => state.categorias)

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    valor: '',
    categoria: '',
    accesibilidad: '',
    notasAccesibilidad: '',
    politicasCancelacion: ''
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

  const handleAccesibilidadChange = (value) => {
    setFormData({
      ...formData,
      accesibilidad: value
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
                  label="Título del plan"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Tour Cartagena Premium"
                  required
                />

                <FormTextarea
                  label="Descripción amplia"
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
                  Galería de fotos
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
                  label="Categoría"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleCategoriaChange}
                  options={categoriaOptions}
                  placeholder="Selecciona una categoría"
                  required
                />

                {/* Accesibilidad */}
                <div className="pt-4 border-t border-cream">
                  <h4 className="text-sm font-semibold text-primary mb-3">Accesibilidad</h4>
                  <FormSelect
                    label="Nivel de accesibilidad"
                    name="accesibilidad"
                    value={formData.accesibilidad}
                    onChange={handleAccesibilidadChange}
                    options={[
                      { value: 'Alta', label: 'Alta' },
                      { value: 'Media', label: 'Media' },
                      { value: 'Por confirmar', label: 'Por confirmar' }
                    ]}
                    placeholder="Selecciona un nivel"
                  />
                  <FormTextarea
                    label="Notas de accesibilidad"
                    name="notasAccesibilidad"
                    value={formData.notasAccesibilidad}
                    onChange={handleChange}
                    placeholder="Describe accesos, rampas, distancias, terreno..."
                    rows={3}
                    className="mt-3"
                  />
                </div>

                {/* Políticas */}
                <div className="pt-4 border-t border-cream">
                  <FormTextarea
                    label="Políticas de cambios y cancelación"
                    name="politicasCancelacion"
                    value={formData.politicasCancelacion}
                    onChange={handleChange}
                    placeholder="Describe las condiciones de cambio y cancelación de este plan..."
                    rows={3}
                  />
                </div>

                {/* Tip box */}
                <div className="p-4 bg-ivory/50 rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-sage mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate">
                    Tip: describe accesos, distancias y ritmos. Eso reduce dudas y aumenta cierres.
                  </p>
                </div>
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
