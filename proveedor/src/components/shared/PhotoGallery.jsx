import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X, Star } from 'lucide-react'

export function PhotoGallery({
  photos = [],
  onAdd,
  onRemove,
  onSelectPrincipal,
  maxPhotos = 10
}) {
  const inputRef = useRef(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        onAdd({
          url: reader.result,
          title: file.name,
          isPrincipal: photos.length === 0
        })
      }
      reader.readAsDataURL(file)
    })
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img
              src={photo.url}
              alt={photo.title || `Foto ${index + 1}`}
              className={`w-full h-32 object-cover rounded-lg border-2 ${
                photo.isPrincipal ? 'border-warning' : 'border-cream'
              }`}
            />

            {photo.isPrincipal && (
              <div className="absolute top-2 left-2">
                <div className="bg-warning text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Principal
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              {!photo.isPrincipal && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/20 text-white hover:bg-white/30"
                  onClick={() => onSelectPrincipal(index)}
                >
                  <Star className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-danger/80 text-white hover:bg-danger"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={handleClick}
            className="w-full h-32 border-2 border-dashed border-cream rounded-lg flex flex-col items-center justify-center gap-2 text-slate hover:border-sage hover:text-sage transition-colors"
          >
            <Plus className="h-8 w-8" />
            <span className="text-xs">Agregar fotos</span>
          </button>
        )}
      </div>

      {photos.length > 0 && (
        <p className="text-xs text-slate">
          Click en la estrella para seleccionar como foto principal
        </p>
      )}
    </div>
  )
}
