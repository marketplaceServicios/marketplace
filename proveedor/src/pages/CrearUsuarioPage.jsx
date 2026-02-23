import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { FormField } from '@/components/forms/FormField'
import { FormSelect } from '@/components/forms/FormSelect'
import { FileUpload } from '@/components/shared/FileUpload'
import { useEquipoStore } from '@/store/equipoStore'
import { roles } from '@/data/mockData'
import { Save, ArrowLeft, Trash2 } from 'lucide-react'

export function CrearUsuarioPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')

  const miembros = useEquipoStore((state) => state.miembros)
  const addMiembro = useEquipoStore((state) => state.addMiembro)
  const updateMiembro = useEquipoStore((state) => state.updateMiembro)
  const deleteMiembro = useEquipoStore((state) => state.deleteMiembro)

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: '',
    fechaNacimiento: '',
    direccion: '',
    rol: '',
    avatar: ''
  })

  useEffect(() => {
    if (editId) {
      const miembro = miembros.find((m) => m.id === parseInt(editId))
      if (miembro) {
        setFormData({
          nombre: miembro.nombre,
          email: miembro.email,
          celular: miembro.celular,
          fechaNacimiento: miembro.fechaNacimiento,
          direccion: miembro.direccion,
          rol: miembro.rol,
          avatar: miembro.avatar
        })
      }
    }
  }, [editId, miembros])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRolChange = (value) => {
    setFormData({
      ...formData,
      rol: value
    })
  }

  const handleAvatarChange = (imageUrl) => {
    setFormData({
      ...formData,
      avatar: imageUrl
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editId) {
        await updateMiembro(parseInt(editId), formData)
      } else {
        await addMiembro(formData)
      }
      navigate('/equipo')
    } catch (err) {
      console.error('Error al guardar miembro:', err)
    }
  }

  const handleDelete = async () => {
    if (editId && confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteMiembro(parseInt(editId))
        navigate('/equipo')
      } catch (err) {
        console.error('Error al eliminar miembro:', err)
      }
    }
  }

  const isEditing = !!editId

  const rolOptions = roles.map((rol) => ({
    value: rol,
    label: rol
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Editar usuario' : 'Crea un nuevo usuario'}
        subtitle={isEditing ? 'Modifica los datos del miembro' : 'Agrega un nuevo miembro a tu equipo'}
        action={
          <Button variant="ghost" onClick={() => navigate('/equipo')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Diligencia los siguientes datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />

              <FormField
                label="Celular"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                placeholder="+57 300 000 0000"
              />

              <FormField
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                placeholder="dd/mm/aaaa"
              />

              <FormField
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección completa"
              />

              <FormSelect
                label="Rol"
                name="rol"
                value={formData.rol}
                onChange={handleRolChange}
                options={rolOptions}
                placeholder="Selecciona un rol"
                required
              />

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Adjunta foto
                </label>
                <FileUpload
                  value={formData.avatar}
                  onChange={handleAvatarChange}
                  placeholder="+"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Guardar cambios' : 'Crear'}
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
