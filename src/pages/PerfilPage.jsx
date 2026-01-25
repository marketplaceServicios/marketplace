import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/authStore'

export function PerfilPage() {
  const { user, updateProfile } = useAuthStore()

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: '',
    fechaNacimiento: '',
    direccion: '',
    rol: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        celular: user.celular || '',
        fechaNacimiento: user.fechaNacimiento || '',
        direccion: user.direccion || '',
        rol: user.rol || ''
      })
    }
  }, [user])

  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    updateProfile({ [field]: value })
  }

  const roles = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Viewer', label: 'Viewer' },
  ]

  return (
    <div>
      <PageHeader title="Configura tu perfil" />

      <div className="bg-white rounded-xl border border-cream p-4 sm:p-6 lg:p-8 shadow-sm max-w-xl">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 sm:mb-8 text-center sm:text-left">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 bg-sage">
            <AvatarImage src={user?.avatar} alt={user?.nombre} />
            <AvatarFallback className="text-lg bg-sage text-white">
              {user?.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-primary text-lg">{user?.username}</p>
            <button className="text-sm text-muted hover:text-accent transition-colors">
              Cambia tu foto de perfil
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-muted mb-2">Nombre</label>
            <Input
              value={formData.nombre}
              onChange={(e) => handleChange('nombre')(e.target.value)}
              className="bg-transparent border-0 border-b border-cream rounded-none px-0 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email')(e.target.value)}
              className="bg-transparent border-0 border-b border-cream rounded-none px-0 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Celular</label>
            <Input
              value={formData.celular}
              onChange={(e) => handleChange('celular')(e.target.value)}
              className="bg-transparent border-0 border-b border-cream rounded-none px-0 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Fecha de nacimiento</label>
            <Input
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => handleChange('fechaNacimiento')(e.target.value)}
              className="bg-transparent border-0 border-b border-cream rounded-none px-0 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Direccion</label>
            <Input
              value={formData.direccion}
              onChange={(e) => handleChange('direccion')(e.target.value)}
              className="bg-transparent border-0 border-b border-cream rounded-none px-0 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Rol</label>
            <Select
              value={formData.rol}
              onValueChange={handleChange('rol')}
            >
              <SelectTrigger className="bg-transparent border-0 border-b border-cream rounded-none px-0">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((rol) => (
                  <SelectItem key={rol.value} value={rol.value}>
                    {rol.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
