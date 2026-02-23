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
  const fetchCategorias = useCategoriasStore((state) => state.fetchCategorias)
  const addCategoria = useCategoriasStore((state) => state.addCategoria)
  const updateCategoria = useCategoriasStore((state) => state.updateCategoria)
  const deleteCategoria = useCategoriasStore((state) => state.deleteCategoria)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: ''
  })

  useEffect(() => {
    if (categorias.length === 0) fetchCategorias()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editId) {
        await updateCategoria(parseInt(editId), formData)
      } else {
        await addCategoria(formData)
      }
      navigate('/categorias')
    } catch (err) {
      console.error('Error al guardar categoría:', err)
    }
  }

  const handleDelete = async () => {
    if (editId && confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await deleteCategoria(parseInt(editId))
        navigate('/categorias')
      } catch (err) {
        console.error('Error al eliminar categoría:', err)
      }
    }
  }

  const isEditing = !!editId

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edita tu categoría' : 'Crea una categoría'}
        subtitle={isEditing ? 'Modifica los datos de la categoría' : 'Agrega una nueva categoría para tus planes'}
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
                label="Título de la categoría"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Playa, Aventura, Cultural"
                required
              />

              <FormTextarea
                label="Descripción amplia"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe esta categoría..."
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
