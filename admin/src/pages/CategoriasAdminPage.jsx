import { useEffect, useState, useRef } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useCategoriasAdminStore } from '@/store/categoriasAdminStore'
import { api } from '@/lib/api'
import { Plus, Pencil, Trash2, Check, X, ImagePlus, AlertTriangle } from 'lucide-react'

const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

function ImageUploadButton({ currentImage, onUploaded }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || null)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError('')

    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      setError(`La imagen pesa ${sizeMB} MB. El máximo permitido es ${MAX_SIZE_MB} MB.`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await api.uploadImage(file)
      onUploaded(url)
    } catch (err) {
      setError('No se pudo subir la imagen. Intenta de nuevo.')
      console.error('Error al subir imagen:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-20 h-14 object-cover rounded-lg border border-cream flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-14 rounded-lg border-2 border-dashed border-cream flex items-center justify-center flex-shrink-0 bg-ivory/50">
            <ImagePlus className="w-5 h-5 text-slate" />
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => { setError(''); inputRef.current?.click() }}
            disabled={uploading}
            className="text-sm text-accent hover:underline disabled:opacity-50"
          >
            {uploading ? 'Subiendo...' : preview ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
          <p className="text-xs text-slate mt-0.5">Máx. {MAX_SIZE_MB} MB · JPG, PNG o WEBP</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
      {error && (
        <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-yellow-700">{error}</p>
            <p className="text-xs text-yellow-600 mt-0.5">Recomendamos imágenes de menos de 500 KB para carga óptima.</p>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoriaRow({ categoria, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [nombre, setNombre] = useState(categoria.nombre)
  const [descripcion, setDescripcion] = useState(categoria.descripcion || '')
  const [imagen, setImagen] = useState(categoria.imagen || '')

  const handleSave = async () => {
    await onUpdate(categoria.id, { nombre, descripcion, imagen })
    setEditing(false)
  }

  const handleCancel = () => {
    setNombre(categoria.nombre)
    setDescripcion(categoria.descripcion || '')
    setImagen(categoria.imagen || '')
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-ivory/50 rounded-lg border border-cream">
        <ImageUploadButton currentImage={imagen} onUploaded={setImagen} />
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="font-medium"
              placeholder="Nombre de la categoría"
            />
            <Input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="text-sm"
              placeholder="Descripción"
            />
          </div>
          <div className="flex gap-2 flex-shrink-0 items-start">
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-cream hover:border-sage/40 transition-colors">
      {categoria.imagen ? (
        <img
          src={categoria.imagen}
          alt={categoria.nombre}
          className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-14 rounded-lg border-2 border-dashed border-cream flex items-center justify-center flex-shrink-0 bg-ivory/50">
          <ImagePlus className="w-5 h-5 text-slate" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-primary">{categoria.nombre}</p>
        {categoria.descripcion && (
          <p className="text-sm text-muted mt-0.5 line-clamp-1">{categoria.descripcion}</p>
        )}
        <p className="text-xs text-slate mt-0.5">{categoria._count?.planes ?? 0} planes</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-danger hover:text-danger"
          onClick={() => {
            if (confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) onDelete(categoria.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function CategoriasAdminPage() {
  const { categorias, loading, fetchCategorias, createCategoria, updateCategoria, deleteCategoria } =
    useCategoriasAdminStore()

  const [showForm, setShowForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagen, setImagen] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => { fetchCategorias() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    setSaving(true)
    setFormError('')
    try {
      await createCategoria({ nombre, descripcion, imagen })
      setNombre('')
      setDescripcion('')
      setImagen('')
      setShowForm(false)
    } catch (err) {
      setFormError('No se pudo crear la categoría. Verifica tu conexión e intenta de nuevo.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías"
        subtitle="Categorías globales que los proveedores usan para organizar sus planes"
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva categoría
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-primary mb-4">Nueva categoría</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <ImageUploadButton currentImage={imagen} onUploaded={setImagen} />
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre (ej: Bodas Silver)"
                required
              />
              <Input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción breve"
              />
              {formError && (
                <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Crear categoría'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setFormError('') }}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-center py-12 text-muted">Cargando categorías...</div>
      )}

      {!loading && (
        <div className="space-y-2">
          {categorias.map((cat) => (
            <CategoriaRow
              key={cat.id}
              categoria={cat}
              onUpdate={updateCategoria}
              onDelete={deleteCategoria}
            />
          ))}
          {categorias.length === 0 && (
            <div className="text-center py-12 text-muted bg-white rounded-xl border border-cream">
              No hay categorías. Crea la primera.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
