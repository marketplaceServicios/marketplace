import { FileText } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export function FormSelect({
  icon: Icon = FileText,
  label,
  value,
  onChange,
  placeholder = "Escoge una opcion",
  options = [],
  className,
  required = false
}) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-cream",
      className
    )}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <label className="text-sm font-medium text-primary">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      </div>
      <div className="sm:ml-auto">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full sm:w-[200px] bg-cream-light border-0">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
