import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { FormField } from '@/components/forms/FormField'
import { FormTextarea } from '@/components/forms/FormTextarea'
import { FormSelect } from '@/components/forms/FormSelect'
import { FileUpload } from '@/components/shared/FileUpload'
import { useAuthStore } from '@/store/authStore'
import { roles } from '@/data/mockData'
import { Save, Camera } from 'lucide-react'

export function PerfilPage() {
  const user = useAuthStore((state) => state.user)
  const updateProfile = useAuthStore((state) => state.updateProfile)

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    celular: user?.celular || '',
    fechaNacimiento: user?.fechaNacimiento || '',
    direccion: user?.direccion || '',
    rol: user?.rol || '',
    avatar: user?.avatar || '',
    rnt: user?.rnt || '',
    politicasGenerales: user?.politicasGenerales || '',
    informacionSoporte: user?.informacionSoporte || ''
  })

  const [showUpload, setShowUpload] = useState(false)

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
    setShowUpload(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    alert('Perfil actualizado correctamente')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const rolOptions = roles.map((rol) => ({
    value: rol,
    label: rol
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configura tu perfil"
        subtitle="Actualiza tu informacion personal"
      />

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <Card>
            <CardContent className="p-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-cream">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar} alt={formData.nombre} />
                    <AvatarFallback className="bg-sage text-white text-xl">
                      {getInitials(formData.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1.5 bg-accent text-white rounded-full hover:bg-accent-hover"
                    onClick={() => setShowUpload(!showUpload)}
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    {formData.nombre || 'Usuario'}
                  </p>
                  <button
                    type="button"
                    className="text-sm text-accent hover:underline"
                    onClick={() => setShowUpload(!showUpload)}
                  >
                    Cambia tu foto de perfil
                  </button>
                </div>
              </div>

              {showUpload && (
                <div className="mb-6 p-4 bg-cream/30 rounded-lg">
                  <FileUpload
                    value={formData.avatar}
                    onChange={handleAvatarChange}
                    placeholder="Seleccionar foto"
                  />
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <FormField
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
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
                  label="Direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Tu direccion"
                />

                <FormSelect
                  label="Rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleRolChange}
                  options={rolOptions}
                  placeholder="Selecciona tu rol"
                />
              </div>

              <Button type="submit" className="w-full mt-6">
                <Save className="h-4 w-4 mr-2" />
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
