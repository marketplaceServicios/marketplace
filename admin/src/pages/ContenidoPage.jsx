import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/shared/FileUpload'
import { useTestimoniosStore } from '@/store/testimoniosStore'
import { api } from '@/lib/api'
import { FileText, Image, Video, Plus, Edit, Trash2, Star, X, Check, Eye, EyeOff, Save, Loader2 } from 'lucide-react'

const mockGuias = [
  { id: 1, titulo: 'Guía de accesibilidad para viajeros Silver', tipo: 'PDF', fecha: '2024-01-10' },
  { id: 2, titulo: 'Cómo preparar tu viaje con calma', tipo: 'Artículo', fecha: '2024-01-08' },
  { id: 3, titulo: 'Recomendaciones para familias cuidadoras', tipo: 'PDF', fecha: '2024-01-05' },
]

const tabs = ['Testimonios', 'Guías', 'Recursos']

const emptyForm = { nombre: '', ciudad: '', texto: '', rating: 5, foto: '' }

export function ContenidoPage() {
  const [activeTab, setActiveTab] = useState('Testimonios')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [fotoFile, setFotoFile] = useState(null)
  const [editFotoFile, setEditFotoFile] = useState(null)

  const { testimonios, loading, fetchTestimonios, createTestimonio, updateTestimonio, deleteTestimonio } = useTestimoniosStore()

  useEffect(() => {
    fetchTestimonios()
  }, [fetchTestimonios])

  const uploadFoto = async (file) => {
    if (!file) return null
    return await api.uploadImage(file)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.texto.trim()) return
    setSaving(true)
    try {
      let foto = form.foto
      if (fotoFile) {
        foto = await uploadFoto(fotoFile)
      }
      await createTestimonio({ ...form, foto })
      setForm(emptyForm)
      setFotoFile(null)
      setShowForm(false)
    } catch (err) {
      console.error('Error al crear testimonio:', err)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setEditForm({ nombre: t.nombre, ciudad: t.ciudad || '', texto: t.texto, rating: t.rating, foto: t.foto || '' })
    setEditFotoFile(null)
  }

  const handleUpdate = async (id) => {
    if (!editForm.nombre.trim() || !editForm.texto.trim()) return
    setSaving(true)
    try {
      let foto = editForm.foto
      if (editFotoFile) {
        foto = await uploadFoto(editFotoFile)
      }
      await updateTestimonio(id, { ...editForm, foto })
      setEditingId(null)
      setEditFotoFile(null)
    } catch (err) {
      console.error('Error al actualizar testimonio:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este testimonio?')) return
    try {
      await deleteTestimonio(id)
    } catch (err) {
      console.error('Error al eliminar testimonio:', err)
    }
  }

  const handleToggleActivo = async (t) => {
    try {
      await updateTestimonio(t.id, { activo: !t.activo })
    } catch (err) {
      console.error('Error al cambiar estado:', err)
    }
  }

  const RatingSelect = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star size={20} className={n <= value ? 'text-golden fill-golden' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  )

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
            <Button onClick={() => { setShowForm(!showForm); setForm(emptyForm); setFotoFile(null) }} size="sm">
              {showForm ? <X size={16} /> : <Plus size={16} />}
              <span className="ml-2">{showForm ? 'Cancelar' : 'Agregar testimonio'}</span>
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="bg-white rounded-xl border border-cream shadow-sm p-4 sm:p-6 mb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">Nombre *</label>
                  <Input
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Nombre completo"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">Ciudad</label>
                  <Input
                    value={form.ciudad}
                    onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                    placeholder="Ciudad"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1 block">Testimonio *</label>
                <Textarea
                  value={form.texto}
                  onChange={(e) => setForm({ ...form, texto: e.target.value })}
                  placeholder="Texto del testimonio..."
                  required
                />
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">Rating</label>
                  <RatingSelect value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
                </div>
                <FileUpload
                  label="Foto"
                  preview={form.foto || null}
                  onChange={(file) => setFotoFile(file)}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 size={16} className="animate-spin mr-2" />}
                  <Save size={16} className="mr-2" />
                  Guardar
                </Button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-accent" />
            </div>
          ) : testimonios.length === 0 ? (
            <div className="text-center py-12 text-muted">
              No hay testimonios. Crea el primero.
            </div>
          ) : (
            <div className="space-y-4">
              {testimonios.map(t => (
                <div key={t.id} className="bg-white rounded-xl border border-cream shadow-sm p-4 sm:p-6">
                  {editingId === t.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-primary mb-1 block">Nombre *</label>
                          <Input
                            value={editForm.nombre}
                            onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-primary mb-1 block">Ciudad</label>
                          <Input
                            value={editForm.ciudad}
                            onChange={(e) => setEditForm({ ...editForm, ciudad: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1 block">Testimonio *</label>
                        <Textarea
                          value={editForm.texto}
                          onChange={(e) => setEditForm({ ...editForm, texto: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <label className="text-sm font-medium text-primary mb-1 block">Rating</label>
                          <RatingSelect value={editForm.rating} onChange={(r) => setEditForm({ ...editForm, rating: r })} />
                        </div>
                        <FileUpload
                          label="Foto"
                          preview={editForm.foto || null}
                          onChange={(file) => setEditFotoFile(file)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                          <X size={16} className="mr-1" /> Cancelar
                        </Button>
                        <Button size="sm" onClick={() => handleUpdate(t.id)} disabled={saving}>
                          {saving && <Loader2 size={16} className="animate-spin mr-1" />}
                          <Check size={16} className="mr-1" /> Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          {t.foto && (
                            <img src={t.foto} alt={t.nombre} className="w-12 h-12 rounded-full object-cover shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-primary italic mb-2">"{t.texto}"</p>
                            <p className="text-sm text-muted">— {t.nombre}{t.ciudad ? `, ${t.ciudad}` : ''}</p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < t.rating ? 'text-golden fill-golden' : 'text-gray-300'} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 shrink-0">
                          <button onClick={() => handleToggleActivo(t)} className="p-1.5 rounded-lg hover:bg-cream text-muted" title={t.activo ? 'Desactivar' : 'Activar'}>
                            {t.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button onClick={() => startEdit(t)} className="p-1.5 rounded-lg hover:bg-cream text-muted">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-danger">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.activo ? 'bg-sage/20 text-sage' : 'bg-cream text-muted'}`}>
                          {t.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
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
