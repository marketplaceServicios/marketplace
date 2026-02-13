import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { FileText, Image, Video, Plus, Edit, Trash2 } from 'lucide-react'

const mockTestimonios = [
  { id: 1, nombre: 'María González', ciudad: 'Bogotá', texto: 'Lo que más me gustó fue la claridad. Sabíamos exactamente qué esperar.', activo: true },
  { id: 2, nombre: 'Carlos Rodríguez', ciudad: 'Medellín', texto: 'Mi mamá se sintió cuidada desde el primer mensaje.', activo: true },
  { id: 3, nombre: 'Ana Martínez', ciudad: 'Manizales', texto: 'El acompañamiento fue excepcional. Nos sentimos tranquilos en todo momento.', activo: true },
]

const mockGuias = [
  { id: 1, titulo: 'Guía de accesibilidad para viajeros Silver', tipo: 'PDF', fecha: '2024-01-10' },
  { id: 2, titulo: 'Cómo preparar tu viaje con calma', tipo: 'Artículo', fecha: '2024-01-08' },
  { id: 3, titulo: 'Recomendaciones para familias cuidadoras', tipo: 'PDF', fecha: '2024-01-05' },
]

const tabs = ['Testimonios', 'Guías', 'Recursos']

export function ContenidoPage() {
  const [activeTab, setActiveTab] = useState('Testimonios')

  return (
    <div>
      <PageHeader
        title="Contenido"
        subtitle="Gestiona testimonios, guías y recursos audiovisuales para educar y dar confianza."
      />

      <div className="flex gap-2 mb-6 border-b border-cream">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Testimonios' && (
        <div>
          <div className="flex justify-end mb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover text-sm font-medium">
              <Plus size={16} />
              Agregar testimonio
            </button>
          </div>
          <div className="space-y-4">
            {mockTestimonios.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-cream shadow-sm p-4 sm:p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-primary italic mb-2">"{t.texto}"</p>
                    <p className="text-sm text-muted">— {t.nombre}, {t.ciudad}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="p-1.5 rounded-lg hover:bg-cream text-muted"><Edit size={16} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-danger/10 text-danger"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.activo ? 'bg-sage/20 text-sage' : 'bg-cream text-muted'}`}>
                    {t.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Guías' && (
        <div>
          <div className="flex justify-end mb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover text-sm font-medium">
              <Plus size={16} />
              Agregar guía
            </button>
          </div>
          <div className="space-y-4">
            {mockGuias.map(g => (
              <div key={g.id} className="bg-white rounded-xl border border-cream shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">{g.titulo}</p>
                    <p className="text-sm text-muted">{g.tipo} · {g.fecha}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-cream text-muted"><Edit size={16} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-danger/10 text-danger"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Recursos' && (
        <div>
          <div className="flex justify-end mb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover text-sm font-medium">
              <Plus size={16} />
              Agregar recurso
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-cream shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center mx-auto mb-3">
                <Image size={24} className="text-primary" />
              </div>
              <p className="font-medium text-primary mb-1">Banco de imágenes</p>
              <p className="text-sm text-muted">12 archivos</p>
            </div>
            <div className="bg-white rounded-xl border border-cream shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center mx-auto mb-3">
                <Video size={24} className="text-primary" />
              </div>
              <p className="font-medium text-primary mb-1">Videos testimoniales</p>
              <p className="text-sm text-muted">3 videos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
