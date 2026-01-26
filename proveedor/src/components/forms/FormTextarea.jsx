export function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  rows = 4,
  variant = 'default',
  className = ''
}) {
  const variantStyles = {
    default: 'bg-white border-cream',
    highlight: 'bg-ivory/50 border-ivory'
  }

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
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-3 py-2 text-sm border rounded-md
          focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${variantStyles[variant]}
          ${error ? 'border-danger focus:ring-danger' : ''}
        `}
      />
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  )
}
