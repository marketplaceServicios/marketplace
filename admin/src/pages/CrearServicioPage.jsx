import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { FileUpload } from '@/components/shared/FileUpload'
import { useServiciosStore } from '@/store/serviciosStore'

export function CrearServicioPage() {
  const navigate = useNavigate()
  const { addServicio } = useServiciosStore()

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null
  })

  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.titulo.trim()) {
      alert('Por favor ingresa un título para el servicio')
      return
    }

    addServicio({
      nombre: formData.titulo,
      descripcion: formData.descripcion
    })

    alert('Tipo de servicio creado exitosamente')
    navigate('/')
  }

  return (
    <div>
      <PageHeader title="Crea un tipo de servicio" />

      <div className="max-w-2xl space-y-4 sm:space-y-6">
        {/* Title Input */}
        <Input
          value={formData.titulo}
          onChange={(e) => handleChange('titulo')(e.target.value)}
          placeholder="Escribe el título de tu nueva categoría"
          className="bg-accent-light border-0 h-12"
        />

        {/* Description */}
        <Textarea
          value={formData.descripcion}
          onChange={(e) => handleChange('descripcion')(e.target.value)}
          placeholder="Escribe una descripción amplia"
          className="min-h-[200px]"
        />

        {/* Image Upload */}
        <div>
          <p className="text-sm font-medium text-primary mb-3">Agrega una foto</p>
          <FileUpload
            onChange={handleChange('imagen')}
            preview={formData.imagen ? URL.createObjectURL(formData.imagen) : "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=300&h=200&fit=crop"}
          />
        </div>

        {/* Submit */}
        <Button onClick={handleSubmit} className="mt-4 w-full sm:w-auto">
          Crear y guardar
        </Button>
      </div>
    </div>
  )
}
