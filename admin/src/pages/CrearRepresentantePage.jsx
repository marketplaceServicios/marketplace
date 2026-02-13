import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  FileText,
  CreditCard,
  MapPin,
  Phone,
  Smartphone,
  Mail
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/forms/FormField'
import { FormSelect } from '@/components/forms/FormSelect'
import { useEmpresasStore } from '@/store/empresasStore'

const tiposDocumento = [
  { value: 'cedula', label: 'Cédula de ciudadanía' },
  { value: 'pasaporte', label: 'Pasaporte' },
  { value: 'cedula_extranjeria', label: 'Cédula de extranjería' },
]

export function CrearRepresentantePage() {
  const navigate = useNavigate()
  const { addEmpresa } = useEmpresasStore()

  const [formData, setFormData] = useState({
    nombre: '',
    tipoDocumento: '',
    documento: '',
    direccion: '',
    telefonoFijo: '',
    celular: '',
    correo: ''
  })

  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Recuperar datos de la empresa del paso anterior
    const empresaData = sessionStorage.getItem('nuevaEmpresa')
    if (empresaData) {
      const empresa = JSON.parse(empresaData)
      addEmpresa({
        ...empresa,
        representante: formData,
        nombreLegal: empresa.nombre,
        planesActivos: 0,
        planesPausados: 0,
        cotizacionesResueltas: 0,
        cotizacionesPendientes: 0,
        reservasConcretadas: 0,
        avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
        documentos: [
          { id: 1, nombre: 'RUT', url: '/docs/rut.pdf' },
          { id: 2, nombre: 'Registro mercantil', url: '/docs/registro.pdf' },
          { id: 3, nombre: 'Certificación bancaria', url: '/docs/banco.pdf' },
          { id: 4, nombre: 'Cédula representante legal', url: '/docs/cedula.pdf' },
        ]
      })
      sessionStorage.removeItem('nuevaEmpresa')
    }

    alert('Empresa creada exitosamente')
    navigate('/empresas-por-servicios')
  }

  return (
    <div>
      <PageHeader title="Información del representante legal" />

      <div className="bg-white rounded-xl border border-cream p-4 sm:p-6 shadow-sm max-w-3xl">
        <FormField
          icon={User}
          label="Nombre del representante legal"
          value={formData.nombre}
          onChange={handleChange('nombre')}
          placeholder="Descripción"
        />

        <FormSelect
          icon={FileText}
          label="Tipo de documento"
          value={formData.tipoDocumento}
          onChange={handleChange('tipoDocumento')}
          placeholder="Escoger uno de la lista"
          options={tiposDocumento}
        />

        <FormField
          icon={CreditCard}
          label="Documento"
          value={formData.documento}
          onChange={handleChange('documento')}
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

        <div className="flex justify-end mt-8 pt-6 border-t border-cream">
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Crear y guardar
          </Button>
        </div>
      </div>
    </div>
  )
}
