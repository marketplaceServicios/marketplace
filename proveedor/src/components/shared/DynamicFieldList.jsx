import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

export function DynamicFieldList({
  fields = [],
  onChange,
  onAdd,
  onRemove,
  titlePlaceholder = 'Titulo del detalle',
  descriptionPlaceholder = 'Descripcion del detalle'
}) {
  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], [key]: value }
    onChange(newFields)
  }

  const handleAdd = () => {
    onAdd({ title: '', description: '' })
  }

  const handleRemove = (index) => {
    onRemove(index)
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={index}
          className="p-4 bg-ivory/50 rounded-lg border border-cream space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              Detalle {index + 1}
            </span>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-danger hover:text-danger/80"
                onClick={() => handleRemove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Input
            value={field.title}
            onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
            placeholder={titlePlaceholder}
            className="bg-white"
          />

          <textarea
            value={field.description}
            onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
            placeholder={descriptionPlaceholder}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-cream rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent resize-none"
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agrega campo
      </Button>
    </div>
  )
}
