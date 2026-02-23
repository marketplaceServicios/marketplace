import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  required = false,
  error,
  disabled = false,
  className = ''
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-primary"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          className={error ? 'border-danger focus:ring-danger' : ''}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  )
}
