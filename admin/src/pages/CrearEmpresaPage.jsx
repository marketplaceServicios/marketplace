import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Briefcase,
  FileText,
  MapPin,
  Phone,
  Smartphone,
  Mail
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/forms/FormField'
import { FormSelect } from '@/components/forms/FormSelect'
import { FileUpload } from '@/components/shared/FileUpload'
import { useServiciosStore } from '@/store/serviciosStore'

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
    logo: null
  })

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
          placeholder="Descripción"
          type="email"
        />

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
