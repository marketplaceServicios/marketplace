import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image } from 'lucide-react'

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  placeholder = 'Agregar foto',
  className = ''
}) {
  const inputRef = useRef(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onChange(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
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
    </div>
  )
}
