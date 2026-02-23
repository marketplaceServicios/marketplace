import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/layout/PageHeader'
import { FormField } from '@/components/forms/FormField'
import { FormTextarea } from '@/components/forms/FormTextarea'
import { FormSelect } from '@/components/forms/FormSelect'
import { PhotoGallery } from '@/components/shared/PhotoGallery'
import { DisponibilidadForm } from '@/components/forms/DisponibilidadForm'
import { AmenitiesSelector } from '@/components/forms/AmenitiesSelector'
import { usePlanesStore } from '@/store/planesStore'
import { useCategoriasStore } from '@/store/categoriasStore'
import { Save, ArrowLeft, Info, Plus, X } from 'lucide-react'

export function EditarPlanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const planes = usePlanesStore((state) => state.planes)
  const fetchPlanes = usePlanesStore((state) => state.fetchPlanes)
  const updatePlan = usePlanesStore((state) => state.updatePlan)
  const categorias = useCategoriasStore((state) => state.categorias)
  const fetchCategorias = useCategoriasStore((state) => state.fetchCategorias)

  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    valor: '',
    categoriaId: '',
    ubicacion: '',
    duracion: '',
    accesibilidad: '',
    notasAccesibilidad: '',
    politicasCancelacion: ''
  })

  const [servicios, setServicios] = useState([''])
  const [amenidades, setAmenidades] = useState([])
  const [fotos, setFotos] = useState([])
  const [disponibilidad, setDisponibilidad] = useState({
    tipo: 'siempre',
    diasSemana: [],
    precioFinDeSemana: null,
    fechasEspeciales: []
  })

  useEffect(() => {
    fetchCategorias()
    if (planes.length === 0) fetchPlanes()
  }, [])

  // Pre-fill form when plan is available
  useEffect(() => {
    const plan = planes.find(p => p.id === parseInt(id))
    if (!plan) return

    const accesibilidad = plan.datoClave?.startsWith('Accesibilidad ')
      ? plan.datoClave.replace('Accesibilidad ', '')
      : ''

    setFormData({
      titulo: plan.titulo || '',
      descripcion: plan.descripcion || '',
      valor: String(plan.valor || ''),
      categoriaId: String(plan.categoriaId || ''),
      ubicacion: plan.ubicacion || '',
      duracion: plan.duracion || '',
      accesibilidad,
      notasAccesibilidad: plan.notasAccesibilidad || '',
      politicasCancelacion: plan.politicasCancelacion || ''
    })

    setServicios(
      plan.incluye?.length > 0 ? plan.incluye : ['']
    )

    setAmenidades(plan.amenidades || [])

    setFotos(
      (plan.imagenes || []).map((url, i) => ({ url, isPrincipal: i === 0 }))
    )

    if (plan.disponibilidad) {
      setDisponibilidad(plan.disponibilidad)
    }

    setReady(true)
  }, [planes, id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddFoto = (foto) => {
    setFotos([...fotos, foto])
  }

  const handleRemoveFoto = (index) => {
    setFotos(fotos.filter((_, i) => i !== index))
  }

  const handleSelectPrincipalFoto = (index) => {
    setFotos(fotos.map((foto, i) => ({ ...foto, isPrincipal: i === index })))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await updatePlan(parseInt(id), {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        valor: parseInt(formData.valor) || 0,
        categoriaId: parseInt(formData.categoriaId),
        ubicacion: formData.ubicacion,
        duracion: formData.duracion,
        datoClave: formData.accesibilidad ? `Accesibilidad ${formData.accesibilidad}` : '',
        notasAccesibilidad: formData.notasAccesibilidad,
        politicasCancelacion: formData.politicasCancelacion,
        imagenes: fotos.map((f) => f.url),
        incluye: servicios.filter((s) => s.trim()),
        amenidades,
        disponibilidad,
      })
      navigate('/planes')
    } catch (err) {
      setError('Error al guardar los cambios. Intenta de nuevo.')
      console.error(err)
    }
  }

  const categoriaOptions = categorias.map((cat) => ({
    value: cat.id,
    label: cat.nombre
  }))

  if (!ready && planes.length === 0) {
    return <div className="text-center py-12 text-muted">Cargando plan...</div>
  }

  if (ready === false && planes.length > 0 && !planes.find(p => p.id === parseInt(id))) {
    return <div className="text-center py-12 text-muted">Plan no encontrado.</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar plan"
        subtitle={formData.titulo || 'Modifica los datos de tu plan'}
        action={
          <Button variant="ghost" onClick={() => navigate('/planes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      {error && (
        <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
          {error}
        </div>
      )}

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

            {/* Servicios incluidos — chips */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-1">Servicios incluidos</h3>
                <p className="text-sm text-slate mb-4">Selecciona los servicios que forman parte del plan. Se muestran como íconos en la web.</p>
                <AmenitiesSelector value={amenidades} onChange={setAmenidades} />
              </CardContent>
            </Card>

            {/* Lo que incluye — texto libre */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-1">Lo que incluye</h3>
                <p className="text-sm text-slate mb-4">Detalla cada ítem incluido en el precio (vuelos, alojamiento, guía...)</p>
                <div className="space-y-2">
                  {servicios.map((servicio, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={servicio}
                        onChange={(e) => {
                          const nuevo = [...servicios]
                          nuevo[index] = e.target.value
                          setServicios(nuevo)
                        }}
                        placeholder="Ej: Vuelos incluidos, Guía turístico, Desayunos..."
                        className="flex-1"
                      />
                      {servicios.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-danger hover:text-danger/80"
                          onClick={() => setServicios(servicios.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setServicios([...servicios, ''])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar ítem
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Disponibilidad */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-1">Disponibilidad y precios</h3>
                <p className="text-sm text-slate mb-4">¿Cuándo está disponible este plan?</p>
                <DisponibilidadForm
                  value={disponibilidad}
                  onChange={setDisponibilidad}
                  precioBase={parseInt(formData.valor) || 0}
                />
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-4">Galería de fotos</h3>
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

                <FormField
                  label="Lugar"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Ej: Cartagena, Colombia"
                />

                <FormField
                  label="Duración"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  placeholder="Ej: 5 días / 4 noches"
                />

                <FormSelect
                  label="Categoría"
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={(value) => setFormData({ ...formData, categoriaId: value })}
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
                    onChange={(value) => setFormData({ ...formData, accesibilidad: value })}
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
              Guardar cambios
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
