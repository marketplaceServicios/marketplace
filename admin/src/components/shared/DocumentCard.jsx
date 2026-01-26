import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DocumentCard({
  title,
  preview,
  onDownload,
  className
}) {
  return (
    <div className={cn(
      "flex flex-col bg-white rounded-xl border border-cream overflow-hidden shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      {/* Preview */}
      <div className="h-36 sm:h-48 bg-cream-light flex items-center justify-center overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <FileText className="w-10 sm:w-12 h-10 sm:h-12 text-slate mx-auto mb-2" />
            <p className="text-xs text-muted line-clamp-4">
              Vista previa del documento...
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 text-center">
        <h4 className="font-semibold text-primary mb-2 sm:mb-3 text-sm sm:text-base">{title}</h4>
        <Button
          variant="default"
          size="sm"
          onClick={onDownload}
          className="w-full"
        >
          Descargar
        </Button>
      </div>
    </div>
  )
}
