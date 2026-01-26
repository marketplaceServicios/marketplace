import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { FormField } from '@/components/forms/FormField'
import { FormTextarea } from '@/components/forms/FormTextarea'
import { FileUpload } from '@/components/shared/FileUpload'
import { useCategoriasStore } from '@/store/categoriasStore'
import { Save, ArrowLeft, Trash2 } from 'lucide-react'

export function CrearCategoriaPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')

  const categorias = useCategoriasStore((state) => state.categorias)
  const addCategoria = useCategoriasStore((state) => state.addCategoria)
  const updateCategoria = useCategoriasStore((state) => state.updateCategoria)
  const deleteCategoria = useCategoriasStore((state) => state.deleteCategoria)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: ''
  })

  useEffect(() => {
    if (editId) {
      const categoria = categorias.find((c) => c.id === parseInt(editId))
      if (categoria) {
        setFormData({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          imagen: categoria.imagen
        })
      }
    }
  }, [editId, categorias])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (imageUrl) => {
    setFormData({
      ...formData,
      imagen: imageUrl
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editId) {
      updateCategoria(parseInt(editId), formData)
    } else {
      addCategoria(formData)
    }

    navigate('/categorias')
  }

  const handleDelete = () => {
    if (editId && confirm('¿Estas seguro de eliminar esta categoria?')) {
      deleteCategoria(parseInt(editId))
      navigate('/categorias')
    }
  }

  const isEditing = !!editId

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edita tu categoria' : 'Crea una categoria'}
        subtitle={isEditing ? 'Modifica los datos de la categoria' : 'Agrega una nueva categoria para tus planes'}
        action={
          <Button variant="ghost" onClick={() => navigate('/categorias')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <Card>
            <CardContent className="p-6 space-y-6">
              <FormField
                label="Titulo de la categoria"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Playa, Aventura, Cultural"
                required
              />

              <FormTextarea
                label="Descripcion amplia"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe esta categoria..."
                variant="highlight"
                rows={5}
                required
              />

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Agrega una foto
                </label>
                <FileUpload
                  value={formData.imagen}
                  onChange={handleImageChange}
                  placeholder="Agregar foto"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Guardar cambios' : 'Crear y guardar'}
                </Button>

                {isEditing && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
