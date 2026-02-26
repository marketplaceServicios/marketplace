import { useState, useRef } from 'react'
import { Paperclip, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FileUpload({
  label,
  accept = "image/*",
  onChange,
  preview,
  className
}) {
  const [previewUrl, setPreviewUrl] = useState(preview)
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onChange?.(file)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn("", className)}>
      {label && (
        <p className="text-sm font-medium text-primary mb-2">{label}</p>
      )}

      <div className="flex items-center gap-3">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 sm:w-40 h-24 sm:h-28 object-cover rounded-lg border border-cream"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-white" />
            </div>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
