import {
  Bus, Utensils, UserCheck, Camera, Home, Sparkles,
  Heart, Wifi, Shield, Coffee, Waves, Car,
  Music, ShoppingBag, Accessibility, Star,
  Compass, Leaf, BookOpen, Activity
} from 'lucide-react'

export const SERVICIOS_DISPONIBLES = [
  { id: 'transport',      label: 'Transporte',        Icon: Bus },
  { id: 'food',           label: 'Alimentación',       Icon: Utensils },
  { id: 'guide',          label: 'Guía turístico',     Icon: UserCheck },
  { id: 'photos',         label: 'Fotos',              Icon: Camera },
  { id: 'hotel',          label: 'Alojamiento',        Icon: Home },
  { id: 'breakfast',      label: 'Desayuno',           Icon: Coffee },
  { id: 'spa',            label: 'SPA',                Icon: Sparkles },
  { id: 'pool',           label: 'Piscina',            Icon: Waves },
  { id: 'medical',        label: 'Asistencia médica',  Icon: Heart },
  { id: 'insurance',      label: 'Seguro de viaje',    Icon: Shield },
  { id: 'wifi',           label: 'WiFi',               Icon: Wifi },
  { id: 'parking',        label: 'Parqueadero',        Icon: Car },
  { id: 'entertainment',  label: 'Entretenimiento',    Icon: Music },
  { id: 'shopping',       label: 'Compras',            Icon: ShoppingBag },
  { id: 'accessibility',  label: 'Silla de ruedas',    Icon: Accessibility },
  { id: 'tour',           label: 'Recorrido guiado',   Icon: Compass },
  { id: 'wellness',       label: 'Bienestar',          Icon: Leaf },
  { id: 'activities',     label: 'Actividades',        Icon: Activity },
  { id: 'workshop',       label: 'Taller / Clase',     Icon: BookOpen },
  { id: 'dinner',         label: 'Cena incluida',      Icon: Star },
]

export function AmenitiesSelector({ value = [], onChange }) {
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
    } else {
      onChange([...value, id])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {SERVICIOS_DISPONIBLES.map(({ id, label, Icon }) => {
        const selected = value.includes(id)
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all
              ${selected
                ? 'bg-sage/15 border-sage text-sage'
                : 'bg-white border-gray-200 text-slate hover:border-sage/50 hover:bg-sage/5'
              }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
