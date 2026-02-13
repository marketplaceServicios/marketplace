import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { ActivityPanel } from '@/components/shared/ActivityPanel'
import { PieChart } from '@/components/charts/PieChart'
import { BarChart } from '@/components/charts/BarChart'
import { usePlanesStore } from '@/store/planesStore'
import { useReservasStore } from '@/store/reservasStore'
import { useCotizacionesStore } from '@/store/cotizacionesStore'
import { FileText, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const navigate = useNavigate()
  const planes = usePlanesStore((state) => state.planes)
  const reservas = useReservasStore((state) => state.reservas)
  const getCotizacionesSinResponder = useCotizacionesStore(
    (state) => state.getCotizacionesSinResponder
  )
  const cotizacionesPendientes = getCotizacionesSinResponder()

  // Data for bar chart - reservations per month
  const reservasBarData = [
    { name: 'Ene', value: 4 },
    { name: 'Feb', value: 7 },
    { name: 'Mar', value: 5 },
    { name: 'Abr', value: 8 },
    { name: 'May', value: 6 },
    { name: 'Jun', value: 9 }
  ]

  // Data for pie chart - reservations by category
  const reservasPieData = [
    { name: 'Ciudades', value: 35 },
    { name: 'Playa', value: 30 },
    { name: 'Naturaleza', value: 20 },
    { name: 'Aventura', value: 15 }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tu panel de gestión"
        subtitle="Aquí ves lo esencial: solicitudes nuevas, reservas confirmadas y tus próximos servicios."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cotizaciones Badge */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/cotizaciones')}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <FileText className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    Cotizaciones sin responder
                  </p>
                  <p className="text-sm text-slate">
                    Tienes solicitudes pendientes
                  </p>
                </div>
              </div>
              <Badge variant="warning" className="text-lg px-4 py-2">
                {cotizacionesPendientes}
              </Badge>
            </CardContent>
          </Card>

          {/* Pendientes de calidad */}
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sage/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-sage" />
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    Pendientes de calidad
                  </p>
                  <p className="text-sm text-slate">
                    fotos / accesibilidad / políticas
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                0
              </Badge>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cantidad de reservas activas</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={reservasBarData}
                color="#889B76"
                dataKey="value"
                xAxisKey="name"
              />
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Reservas por categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={reservasPieData}
                dataKey="value"
                nameKey="name"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Activity Panel */}
        <div className="lg:col-span-1">
          <ActivityPanel
            planesDisponibles={planes.length}
            cotizacionesResueltas={10}
            reservasActivas={reservas.length}
          />
        </div>
      </div>
    </div>
  )
}
