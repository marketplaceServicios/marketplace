import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, FileText, Calendar } from 'lucide-react'

export function ActivityPanel({
  planesDisponibles = 0,
  cotizacionesResueltas = 0,
  reservasActivas = 0
}) {
  const activities = [
    {
      icon: Package,
      value: planesDisponibles,
      label: 'Planes disponibles',
      color: 'text-sage'
    },
    {
      icon: FileText,
      value: cotizacionesResueltas,
      label: 'Cotizaciones resueltas en el ultimo mes',
      color: 'text-accent'
    },
    {
      icon: Calendar,
      value: reservasActivas,
      label: 'Reservas activas para la proxima semana',
      color: 'text-primary'
    }
  ]

  return (
    <Card className="bg-cream/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-primary">Tu actividad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-white rounded-lg"
          >
            <div className={`p-2 rounded-lg bg-cream ${activity.color}`}>
              <activity.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{activity.value}</p>
              <p className="text-sm text-slate">{activity.label}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
