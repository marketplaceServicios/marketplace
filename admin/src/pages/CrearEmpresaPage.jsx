import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Briefcase,
  FileText,
  MapPin,
  Phone,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/forms/FormField'
import { FormSelect } from '@/components/forms/FormSelect'
import { FileUpload } from '@/components/shared/FileUpload'
import { useServiciosStore } from '@/store/serviciosStore'

function generatePassword() {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$'
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function CrearEmpresaPage() {
  const navigate = useNavigate()
  const { servicios } = useServiciosStore()

  const [formData, setFormData] = useState({
    nombre: '',
    tipoServicio: '',
    nit: '',
    direccion: '',
    telefonoFijo: '',
    celular: '',
    correo: '',
    password: '',
    logo: null
  })
  const [showPassword, setShowPassword] = useState(true)

  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    sessionStorage.setItem('nuevaEmpresa', JSON.stringify(formData))
    navigate('/crear-empresa/representante')
  }

  const serviciosOptions = servicios.map(s => ({
    value: s.nombre,
    label: s.nombre
  }))

  return (
    <div>
      <PageHeader title="Crear empresa" />

      <div className="bg-white rounded-xl border border-cream p-4 sm:p-6 shadow-sm max-w-3xl">
        <FormField
          icon={Building2}
          label="Nombre de la empresa:"
          value={formData.nombre}
          onChange={handleChange('nombre')}
          placeholder="Descripción"
        />

        <FormSelect
          icon={Briefcase}
          label="Tipo de servicio:"
          value={formData.tipoServicio}
          onChange={handleChange('tipoServicio')}
          placeholder="Escoge un servicio"
          options={serviciosOptions}
        />

        <FormField
          icon={FileText}
          label="NIT de la empresa:"
          value={formData.nit}
          onChange={handleChange('nit')}
          placeholder="Número"
          type="text"
        />

        <FormField
          icon={MapPin}
          label="Dirección"
          value={formData.direccion}
          onChange={handleChange('direccion')}
          placeholder="Descripción"
        />

        <FormField
          icon={Phone}
          label="Teléfono fijo"
          value={formData.telefonoFijo}
          onChange={handleChange('telefonoFijo')}
          placeholder="Descripción"
        />

        <FormField
          icon={Smartphone}
          label="Celular"
          value={formData.celular}
          onChange={handleChange('celular')}
          placeholder="Descripción"
        />

        <FormField
          icon={Mail}
          label="Correo"
          value={formData.correo}
          onChange={handleChange('correo')}
          placeholder="correo@empresa.com"
          type="email"
        />

        {/* Contraseña visible con toggle y generador */}
        <div className="flex items-start gap-3 sm:gap-4 py-3 border-b border-cream">
          <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center mt-1">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-primary mb-1">
              Contraseña de acceso al panel
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password')(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="bg-transparent border-0 p-0 h-auto text-muted focus:ring-0 font-mono pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-slate hover:text-primary"
                  title={showPassword ? 'Ocultar' : 'Mostrar'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleChange('password')(generatePassword())}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sage/10 text-sage hover:bg-sage/20 transition-colors whitespace-nowrap flex-shrink-0"
                title="Generar contraseña segura"
              >
                <RefreshCw className="h-3 w-3" />
                Generar
              </button>
            </div>
            <p className="text-xs text-muted mt-1">
              El proveedor deberá cambiarla en su primer acceso. El sistema le enviará un correo con estas credenciales.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-cream">
          <FileUpload
            label="Agregar el logo"
            onChange={handleChange('logo')}
          />

          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
