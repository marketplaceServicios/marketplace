import { Input } from '@/components/ui/input'

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
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
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? 'border-danger focus:ring-danger' : ''}
      />
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  )
}
