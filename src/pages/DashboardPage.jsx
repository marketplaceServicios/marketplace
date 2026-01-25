import { StatsCard } from '@/components/shared/StatsCard'
import { ActivityPanel } from '@/components/shared/ActivityPanel'
import { PieChart } from '@/components/charts/PieChart'
import { BarChart } from '@/components/charts/BarChart'
import { dashboardData } from '@/data/mockData'

export function DashboardPage() {
  const activityItems = [
    { value: dashboardData.actividad.empresasUltimoMes, label: 'Empresas asociadas en el ultimo mes' },
    { value: dashboardData.actividad.empresasActivas, label: 'Empresas activas en la plataforma' },
    { value: dashboardData.actividad.serviciosAsociados, label: 'Cantidad de servicios asociados a la plataforma' },
  ]

  return (
    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6 sm:mb-8">Bienvenido!</h1>

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
