import { FileText } from 'lucide-react'
import { Input, Textarea } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function FormField({
  icon: Icon = FileText,
  label,
  value,
  onChange,
  placeholder = "Descripcion",
  type = "text",
  multiline = false,
  className,
  inputClassName,
  required = false
}) {
  const handleChange = (e) => {
    onChange?.(e.target.value)
  }

  return (
    <div className={cn(
      "flex items-start gap-3 sm:gap-4 py-3 border-b border-cream",
      className
    )}>
      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center mt-1">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-primary mb-1">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
        {multiline ? (
          <Textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={cn("bg-accent-light border-0", inputClassName)}
          />
        ) : (
          <Input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={cn("bg-transparent border-0 p-0 h-auto text-muted focus:ring-0", inputClassName)}
          />
        )}
      </div>
    </div>
  )
}
