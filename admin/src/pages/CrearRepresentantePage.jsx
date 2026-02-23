import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, FileText, CreditCard, MapPin, Phone, Smartphone, Mail } from 'lucide-react'
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleSubmit = async () => {
    setError('')
    const empresaData = sessionStorage.getItem('nuevaEmpresa')
    if (!empresaData) {
      setError('No se encontraron los datos de la empresa. Vuelve al paso anterior.')
      return
    }

    const empresa = JSON.parse(empresaData)

    if (!empresa.correo || !empresa.password) {
      setError('La empresa debe tener correo y contraseña.')
      return
    }

    setLoading(true)
    try {
      await addEmpresa({
        ...empresa,
        representante: formData,
        nombreLegal: empresa.nombreLegal || empresa.nombre,
      })
      sessionStorage.removeItem('nuevaEmpresa')
      navigate('/empresas-por-servicios')
    } catch (err) {
      setError(err.message || 'Error al crear la empresa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Información del representante legal" />

      <div className="bg-white rounded-xl border border-cream p-4 sm:p-6 shadow-sm max-w-3xl">
        <FormField icon={User} label="Nombre del representante legal" value={formData.nombre} onChange={handleChange('nombre')} placeholder="Nombre completo" />
        <FormSelect icon={FileText} label="Tipo de documento" value={formData.tipoDocumento} onChange={handleChange('tipoDocumento')} placeholder="Escoger uno de la lista" options={tiposDocumento} />
        <FormField icon={CreditCard} label="Documento" value={formData.documento} onChange={handleChange('documento')} placeholder="Número" type="text" />
        <FormField icon={MapPin} label="Dirección" value={formData.direccion} onChange={handleChange('direccion')} placeholder="Dirección" />
        <FormField icon={Phone} label="Teléfono fijo" value={formData.telefonoFijo} onChange={handleChange('telefonoFijo')} placeholder="Teléfono fijo" />
        <FormField icon={Smartphone} label="Celular" value={formData.celular} onChange={handleChange('celular')} placeholder="Celular" />
        <FormField icon={Mail} label="Correo" value={formData.correo} onChange={handleChange('correo')} placeholder="correo@ejemplo.com" type="email" />

        {error && (
          <p className="text-red-500 text-sm mt-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex justify-end mt-8 pt-6 border-t border-cream">
          <Button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Creando...' : 'Crear y guardar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
