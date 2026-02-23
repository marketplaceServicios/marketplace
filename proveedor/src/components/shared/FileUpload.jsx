import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Image, AlertTriangle } from 'lucide-react'

const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  placeholder = 'Agregar foto',
  className = ''
}) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')

  const handleClick = () => {
    setError('')
    inputRef.current?.click()
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      setError(`La imagen pesa ${sizeMB} MB. El máximo permitido es ${MAX_SIZE_MB} MB.`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setError('')
    const reader = new FileReader()
    reader.onloadend = () => {
      onChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setError('')
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-cream"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 bg-danger text-white rounded-full hover:bg-danger/90"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-32 h-32 border-2 border-dashed border-cream rounded-lg flex flex-col items-center justify-center gap-2 text-slate hover:border-sage hover:text-sage transition-colors"
        >
          <Image className="h-8 w-8" />
          <span className="text-xs text-center px-2">{placeholder}</span>
        </button>
      )}

      {error && (
        <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg max-w-xs">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-yellow-700">{error}</p>
            <p className="text-xs text-yellow-600 mt-0.5">Recomendamos imágenes de menos de 500 KB.</p>
          </div>
        </div>
      )}
    </div>
  )
}
