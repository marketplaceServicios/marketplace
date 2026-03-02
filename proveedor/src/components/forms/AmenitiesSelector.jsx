import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import {
  Bus, Utensils, UserCheck, Camera, Home, Sparkles,
  Heart, Wifi, Shield, Coffee, Waves, Car,
  Music, ShoppingBag, Accessibility, Star,
  Compass, Leaf, BookOpen, Activity,
  MapPin, Clock, Sun, Wind, Dumbbell, Bike, Baby, Flame, Flower2, Soup,
} from 'lucide-react'

const ICON_MAP = {
  Bus, Utensils, UserCheck, Camera, Home, Sparkles,
  Heart, Wifi, Shield, Coffee, Waves, Car,
  Music, ShoppingBag, Accessibility, Star,
  Compass, Leaf, BookOpen, Activity,
  MapPin, Clock, Sun, Wind, Dumbbell, Bike, Baby, Flame, Flower2, Soup,
}

// Lista base hardcodeada — se usa como fallback si la API no devuelve datos
const SERVICIOS_BASE = [
  { slug: 'transport',     label: 'Transporte',       icono: 'Bus'           },
  { slug: 'food',          label: 'Alimentación',      icono: 'Utensils'      },
  { slug: 'guide',         label: 'Guía turístico',    icono: 'UserCheck'     },
  { slug: 'photos',        label: 'Fotos',             icono: 'Camera'        },
  { slug: 'hotel',         label: 'Alojamiento',       icono: 'Home'          },
  { slug: 'breakfast',     label: 'Desayuno',          icono: 'Coffee'        },
  { slug: 'spa',           label: 'SPA',               icono: 'Sparkles'      },
  { slug: 'pool',          label: 'Piscina',           icono: 'Waves'         },
  { slug: 'medical',       label: 'Asistencia médica', icono: 'Heart'         },
  { slug: 'insurance',     label: 'Seguro de viaje',   icono: 'Shield'        },
  { slug: 'wifi',          label: 'WiFi',              icono: 'Wifi'          },
  { slug: 'parking',       label: 'Parqueadero',       icono: 'Car'           },
  { slug: 'entertainment', label: 'Entretenimiento',   icono: 'Music'         },
  { slug: 'shopping',      label: 'Compras',           icono: 'ShoppingBag'   },
  { slug: 'accessibility', label: 'Silla de ruedas',   icono: 'Accessibility' },
  { slug: 'tour',          label: 'Recorrido guiado',  icono: 'Compass'       },
  { slug: 'wellness',      label: 'Bienestar',         icono: 'Leaf'          },
  { slug: 'activities',    label: 'Actividades',       icono: 'Activity'      },
  { slug: 'workshop',      label: 'Taller / Clase',    icono: 'BookOpen'      },
  { slug: 'dinner',        label: 'Cena incluida',     icono: 'Star'          },
]

export function AmenitiesSelector({ value = [], onChange }) {
  const [servicios, setServicios] = useState(SERVICIOS_BASE)

  useEffect(() => {
    api.get('/servicios-incluidos')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServicios(data)
        }
        // Si la API devuelve vacío o falla, se mantiene SERVICIOS_BASE
      })
      .catch(() => {
        // Silencioso — mantiene la lista base hardcodeada
      })
  }, [])

  const toggle = (slug) => {
    if (value.includes(slug)) {
      onChange(value.filter((v) => v !== slug))
    } else {
      onChange([...value, slug])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {servicios.map(({ slug, label, icono }) => {
        const Icon = ICON_MAP[icono] || Star
        const selected = value.includes(slug)
        return (
          <button
            key={slug}
            type="button"
            onClick={() => toggle(slug)}
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
