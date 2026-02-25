import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/shared/FileUpload'
import { useTestimoniosStore } from '@/store/testimoniosStore'
import { useExperiencias360Store } from '@/store/experiencias360Store'
import { useEnlacesRapidosStore } from '@/store/enlacesRapidosStore'
import { api } from '@/lib/api'
import { FileText, Image, Video, Plus, Edit, Trash2, Star, X, Check, Eye, EyeOff, Save, Loader2, Globe, Link2 } from 'lucide-react'

const mockGuias = [
  { id: 1, titulo: 'Guía de accesibilidad para viajeros Silver', tipo: 'PDF', fecha: '2024-01-10' },
  { id: 2, titulo: 'Cómo preparar tu viaje con calma', tipo: 'Artículo', fecha: '2024-01-08' },
  { id: 3, titulo: 'Recomendaciones para familias cuidadoras', tipo: 'PDF', fecha: '2024-01-05' },
]

const tabs = ['Testimonios', 'Experiencias 360', 'Enlaces rápidos', 'Guías', 'Recursos']

const emptyForm = { nombre: '', ciudad: '', texto: '', rating: 5, foto: '' }
const emptyExp360Form = { titulo: '', descripcion: '', iframeSrc: '', thumbnail: '', orden: 0 }
const emptyEnlaceForm = { titulo: '', url: '', abrirNuevaPestana: false, orden: 0 }

export function ContenidoPage() {
  const [activeTab, setActiveTab] = useState('Testimonios')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [fotoFile, setFotoFile] = useState(null)
  const [editFotoFile, setEditFotoFile] = useState(null)

  // Experiencias 360 state
  const [showExp360Form, setShowExp360Form] = useState(false)
  const [exp360Form, setExp360Form] = useState(emptyExp360Form)
  const [editingExp360Id, setEditingExp360Id] = useState(null)
  const [editExp360Form, setEditExp360Form] = useState(emptyExp360Form)
  const [exp360ThumbFile, setExp360ThumbFile] = useState(null)
  const [editExp360ThumbFile, setEditExp360ThumbFile] = useState(null)

  const { testimonios, loading, fetchTestimonios, createTestimonio, updateTestimonio, deleteTestimonio } = useTestimoniosStore()
  const { experiencias, loading: loadingExp360, fetchExperiencias, createExperiencia, updateExperiencia, deleteExperiencia } = useExperiencias360Store()
  const { enlaces, loading: loadingEnlaces, fetchEnlaces, createEnlace, updateEnlace, deleteEnlace } = useEnlacesRapidosStore()

  // Enlaces rápidos state
  const [showEnlaceForm, setShowEnlaceForm] = useState(false)
  const [enlaceForm, setEnlaceForm] = useState(emptyEnlaceForm)
  const [editingEnlaceId, setEditingEnlaceId] = useState(null)
  const [editEnlaceForm, setEditEnlaceForm] = useState(emptyEnlaceForm)

  useEffect(() => {
    fetchTestimonios()
    fetchExperiencias()
    fetchEnlaces()
  }, [fetchTestimonios, fetchExperiencias, fetchEnlaces])

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

      {activeTab === 'Experiencias 360' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setShowExp360Form(!showExp360Form); setExp360Form(emptyExp360Form); setExp360ThumbFile(null) }} size="sm">
              {showExp360Form ? <X size={16} /> : <Plus size={16} />}
              <span className="ml-2">{showExp360Form ? 'Cancelar' : 'Agregar experiencia 360'}</span>
            </Button>
          </div>

          {showExp360Form && (
            <form onSubmit={async (e) => {
              e.preventDefault()
              if (!exp360Form.titulo.trim() || !exp360Form.iframeSrc.trim()) return
              setSaving(true)
              try {
                let thumbnail = exp360Form.thumbnail
                if (exp360ThumbFile) thumbnail = await uploadFoto(exp360ThumbFile)
                await createExperiencia({ ...exp360Form, thumbnail })
                setExp360Form(emptyExp360Form)
                setExp360ThumbFile(null)
                setShowExp360Form(false)
              } catch (err) {
                console.error('Error al crear experiencia 360:', err)
              } finally {
                setSaving(false)
              }
            }} className="bg-white rounded-xl border border-cream shadow-sm p-4 sm:p-6 mb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">Título *</label>
                  <Input
                    value={exp360Form.titulo}
                    onChange={(e) => setExp360Form({ ...exp360Form, titulo: e.target.value })}
                    placeholder="Ej: La Hermita"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">Orden</label>
                  <Input
                    type="number"
                    value={exp360Form.orden}
                    onChange={(e) => setExp360Form({ ...exp360Form, orden: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1 block">Descripción</label>
                <Textarea
                  value={exp360Form.descripcion}
                  onChange={(e) => setExp360Form({ ...exp360Form, descripcion: e.target.value })}
                  placeholder="Descripción de la experiencia..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1 block">URL del iframe (Kuula) *</label>
                <Input
                  value={exp360Form.iframeSrc}
                  onChange={(e) => setExp360Form({ ...exp360Form, iframeSrc: e.target.value })}
                  placeholder="https://kuula.co/share/collection/..."
                  required
                />
              </div>
              <div className="flex items-center gap-6">
                <FileUpload
                  label="Thumbnail"
                  preview={exp360Form.thumbnail || null}
                  onChange={(file) => setExp360ThumbFile(file)}
                />
                <div className="flex-1">
                  <label className="text-sm font-medium text-primary mb-1 block">O pegar URL de imagen</label>
                  <Input
                    value={exp360Form.thumbnail}
                    onChange={(e) => setExp360Form({ ...exp360Form, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
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

          {loadingExp360 ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-accent" />
            </div>
          ) : experiencias.length === 0 ? (
            <div className="text-center py-12 text-muted">
              No hay experiencias 360. Crea la primera.
            </div>
          ) : (
            <div className="space-y-4">
              {experiencias.map(exp => (
                <div key={exp.id} className="bg-white rounded-xl border border-cream shadow-sm p-4 sm:p-6">
                  {editingExp360Id === exp.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-primary mb-1 block">Título *</label>
                          <Input
                            value={editExp360Form.titulo}
                            onChange={(e) => setEditExp360Form({ ...editExp360Form, titulo: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-primary mb-1 block">Orden</label>
                          <Input
                            type="number"
                            value={editExp360Form.orden}
                            onChange={(e) => setEditExp360Form({ ...editExp360Form, orden: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1 block">Descripción</label>
                        <Textarea
                          value={editExp360Form.descripcion}
                          onChange={(e) => setEditExp360Form({ ...editExp360Form, descripcion: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1 block">URL del iframe (Kuula) *</label>
                        <Input
                          value={editExp360Form.iframeSrc}
                          onChange={(e) => setEditExp360Form({ ...editExp360Form, iframeSrc: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex items-center gap-6">
                        <FileUpload
                          label="Thumbnail"
                          preview={editExp360Form.thumbnail || null}
                          onChange={(file) => setEditExp360ThumbFile(file)}
                        />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-primary mb-1 block">O pegar URL de imagen</label>
                          <Input
                            value={editExp360Form.thumbnail}
                            onChange={(e) => setEditExp360Form({ ...editExp360Form, thumbnail: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingExp360Id(null)}>
                          <X size={16} className="mr-1" /> Cancelar
                        </Button>
                        <Button size="sm" disabled={saving} onClick={async () => {
                          if (!editExp360Form.titulo.trim() || !editExp360Form.iframeSrc.trim()) return
                          setSaving(true)
                          try {
                            let thumbnail = editExp360Form.thumbnail
                            if (editExp360ThumbFile) thumbnail = await uploadFoto(editExp360ThumbFile)
                            await updateExperiencia(exp.id, { ...editExp360Form, thumbnail })
                            setEditingExp360Id(null)
                            setEditExp360ThumbFile(null)
                          } catch (err) {
                            console.error('Error al actualizar experiencia 360:', err)
                          } finally {
                            setSaving(false)
                          }
                        }}>
                          {saving && <Loader2 size={16} className="animate-spin mr-1" />}
                          <Check size={16} className="mr-1" /> Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          {exp.thumbnail && (
                            <img src={exp.thumbnail} alt={exp.titulo} className="w-20 h-14 rounded-lg object-cover shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Globe size={14} className="text-accent shrink-0" />
                              <p className="font-medium text-primary">{exp.titulo}</p>
                            </div>
                            {exp.descripcion && <p className="text-sm text-muted mb-1 line-clamp-1">{exp.descripcion}</p>}
                            <p className="text-xs text-muted truncate">{exp.iframeSrc}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 shrink-0">
                          <button onClick={async () => {
                            try { await updateExperiencia(exp.id, { activo: !exp.activo }) } catch (err) { console.error(err) }
                          }} className="p-1.5 rounded-lg hover:bg-cream text-muted" title={exp.activo ? 'Desactivar' : 'Activar'}>
                            {exp.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button onClick={() => {
                            setEditingExp360Id(exp.id)
                            setEditExp360Form({ titulo: exp.titulo, descripcion: exp.descripcion || '', iframeSrc: exp.iframeSrc, thumbnail: exp.thumbnail || '', orden: exp.orden || 0 })
                            setEditExp360ThumbFile(null)
                          }} className="p-1.5 rounded-lg hover:bg-cream text-muted">
                            <Edit size={16} />
                          </button>
                          <button onClick={async () => {
                            if (!confirm('¿Eliminar esta experiencia 360?')) return
                            try { await deleteExperiencia(exp.id) } catch (err) { console.error(err) }
                          }} className="p-1.5 rounded-lg hover:bg-danger/10 text-danger">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${exp.activo ? 'bg-sage/20 text-sage' : 'bg-cream text-muted'}`}>
                          {exp.activo ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-cream text-muted">
                          Orden: {exp.orden}
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

      {activeTab === 'Enlaces rápidos' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setShowEnlaceForm(!showEnlaceForm); setEnlaceForm(emptyEnlaceForm) }} size="sm">
              {showEnlaceForm ? <X size={16} /> : <Plus size={16} />}
              <span className="ml-2">{showEnlaceForm ? 'Cancelar' : 'Agregar enlace'}</span>
            </Button>
          </div>

          {showEnlaceForm && (
            <form onSubmit={async (e) => {
              e.preventDefault()
              if (!enlaceForm.titulo.trim() || !enlaceForm.url.trim()) return
              setSaving(true)
              try {
                await createEnlace(enlaceForm)
                setEnlaceForm(emptyEnlaceForm)
                setShowEnlaceForm(false)
              } catch (err) {
                console.error('Error al crear enlace:', err)
              } finally {
                setSaving(false)
              }
            }} className="bg-white rounded-xl border border-cream shadow-sm p-4 sm:p-6 mb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">Título *</label>
                  <Input
                    value={enlaceForm.titulo}
                    onChange={(e) => setEnlaceForm({ ...enlaceForm, titulo: e.target.value })}
                    placeholder="Ej: Inicio"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">URL *</label>
                  <Input
                    value={enlaceForm.url}
                    onChange={(e) => setEnlaceForm({ ...enlaceForm, url: e.target.value })}
                    placeholder="Ej: /planes o https://..."
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">Orden</label>
                  <Input
                    type="number"
                    value={enlaceForm.orden}
                    onChange={(e) => setEnlaceForm({ ...enlaceForm, orden: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enlaceForm.abrirNuevaPestana}
                  onChange={(e) => setEnlaceForm({ ...enlaceForm, abrirNuevaPestana: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-sm text-primary">Abrir en nueva pestaña</span>
              </label>
              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 size={16} className="animate-spin mr-2" />}
                  <Save size={16} className="mr-2" />
                  Guardar
                </Button>
              </div>
            </form>
          )}

          {loadingEnlaces ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-accent" />
            </div>
          ) : enlaces.length === 0 ? (
            <div className="text-center py-12 text-muted">
              No hay enlaces rápidos. Crea el primero.
            </div>
          ) : (
            <div className="space-y-3">
              {enlaces.map(enlace => (
                <div key={enlace.id} className="bg-white rounded-xl border border-cream shadow-sm p-4 sm:p-5">
                  {editingEnlaceId === enlace.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-primary mb-1 block">Título *</label>
                          <Input
                            value={editEnlaceForm.titulo}
                            onChange={(e) => setEditEnlaceForm({ ...editEnlaceForm, titulo: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-primary mb-1 block">URL *</label>
                          <Input
                            value={editEnlaceForm.url}
                            onChange={(e) => setEditEnlaceForm({ ...editEnlaceForm, url: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-primary mb-1 block">Orden</label>
                          <Input
                            type="number"
                            value={editEnlaceForm.orden}
                            onChange={(e) => setEditEnlaceForm({ ...editEnlaceForm, orden: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editEnlaceForm.abrirNuevaPestana}
                          onChange={(e) => setEditEnlaceForm({ ...editEnlaceForm, abrirNuevaPestana: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className="text-sm text-primary">Abrir en nueva pestaña</span>
                      </label>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingEnlaceId(null)}>
                          <X size={16} className="mr-1" /> Cancelar
                        </Button>
                        <Button size="sm" disabled={saving} onClick={async () => {
                          if (!editEnlaceForm.titulo.trim() || !editEnlaceForm.url.trim()) return
                          setSaving(true)
                          try {
                            await updateEnlace(enlace.id, editEnlaceForm)
                            setEditingEnlaceId(null)
                          } catch (err) {
                            console.error('Error al actualizar enlace:', err)
                          } finally {
                            setSaving(false)
                          }
                        }}>
                          {saving && <Loader2 size={16} className="animate-spin mr-1" />}
                          <Check size={16} className="mr-1" /> Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Link2 size={16} className="text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-primary">{enlace.titulo}</p>
                          <p className="text-sm text-muted truncate">{enlace.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4 shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${enlace.activo ? 'bg-sage/20 text-sage' : 'bg-cream text-muted'}`}>
                          {enlace.activo ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-cream text-muted">
                          #{enlace.orden}
                        </span>
                        <button onClick={async () => {
                          try { await updateEnlace(enlace.id, { activo: !enlace.activo }) } catch (err) { console.error(err) }
                        }} className="p-1.5 rounded-lg hover:bg-cream text-muted" title={enlace.activo ? 'Desactivar' : 'Activar'}>
                          {enlace.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button onClick={() => {
                          setEditingEnlaceId(enlace.id)
                          setEditEnlaceForm({ titulo: enlace.titulo, url: enlace.url, abrirNuevaPestana: enlace.abrirNuevaPestana || false, orden: enlace.orden || 0 })
                        }} className="p-1.5 rounded-lg hover:bg-cream text-muted">
                          <Edit size={16} />
                        </button>
                        <button onClick={async () => {
                          if (!confirm('¿Eliminar este enlace?')) return
                          try { await deleteEnlace(enlace.id) } catch (err) { console.error(err) }
                        }} className="p-1.5 rounded-lg hover:bg-danger/10 text-danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
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
