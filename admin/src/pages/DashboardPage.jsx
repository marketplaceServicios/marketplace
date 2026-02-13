import { StatsCard } from '@/components/shared/StatsCard'
import { ActivityPanel } from '@/components/shared/ActivityPanel'
import { PieChart } from '@/components/charts/PieChart'
import { BarChart } from '@/components/charts/BarChart'
import { dashboardData } from '@/data/mockData'
import { Clock, FileText, Calendar, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function DashboardPage() {
  const activityItems = [
    { value: dashboardData.actividad.empresasUltimoMes, label: 'Empresas asociadas en el último mes' },
    { value: dashboardData.actividad.empresasActivas, label: 'Empresas activas en la plataforma' },
    { value: dashboardData.actividad.serviciosAsociados, label: 'Cantidad de servicios asociados a la plataforma' },
  ]

  const adminStats = [
    { label: 'Proveedores pendientes de aprobación', count: 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Planes por revisar', count: 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Reservas en curso', count: 0, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Incidencias y soporte', count: 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Panel general</h1>
          <p className="text-muted mt-1 text-sm sm:text-base">Monitorea lo importante: actividad, calidad, solicitudes y estado de contenido.</p>
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {adminStats.map((stat) => (
            <Card key={stat.label} className="card-hover">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stat.count}</p>
                  <p className="text-xs text-muted leading-tight">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Pie Chart Card */}
          <StatsCard title="Tipos de servicios activos en la plataforma" className="card-hover">
            <PieChart data={dashboardData.serviciosActivos} />
          </StatsCard>

          {/* Bar Chart Card */}
          <StatsCard title="Empresas inscritas por tipo de servicio" className="card-hover">
            <BarChart
              data={dashboardData.empresasPorServicio}
              title="KPI 1"
              dataKey="empresas"
            />
          </StatsCard>
        </div>
      </div>

      {/* Activity Panel */}
      <div className="w-full xl:w-72 flex-shrink-0">
        <ActivityPanel items={activityItems} />
      </div>
    </div>
  )
}
