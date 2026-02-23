import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/shared/StatsCard'
import { ActivityPanel } from '@/components/shared/ActivityPanel'
import { PieChart } from '@/components/charts/PieChart'
import { BarChart } from '@/components/charts/BarChart'
import { Clock, FileText, Calendar, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/api'

const COLORES_SERVICIOS = ['#F5A524', '#EF4444', '#10B981', '#6366F1', '#8B5CF6', '#0EA5E9', '#F97316']

export function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const activityItems = stats ? [
    { value: stats.proveedores.total, label: 'Empresas registradas en la plataforma' },
    { value: stats.proveedores.activos, label: 'Empresas activas en la plataforma' },
    { value: stats.planes, label: 'Planes activos publicados' },
    { value: stats.usuarios, label: 'Usuarios registrados en la web' },
  ] : []

  const reservasPendientes = stats?.reservas?.porEstado?.find(r => r.estado === 'pendiente')?._count?.estado || 0
  const reservasEnCurso = stats?.reservas?.porEstado?.find(r => r.estado === 'confirmada')?._count?.estado || 0
  const proveedoresInactivos = (stats?.proveedores?.total || 0) - (stats?.proveedores?.activos || 0)

  const adminStats = [
    { label: 'Proveedores inactivos', count: proveedoresInactivos, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Planes por revisar', count: stats?.planes || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Reservas en curso', count: reservasEnCurso, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Reservas pendientes', count: reservasPendientes, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  // Datos para gráficos (placeholders con datos reales cuando estén disponibles)
  const serviciosActivos = [
    { name: 'Proveedores activos', value: stats?.proveedores?.activos || 0, color: COLORES_SERVICIOS[0] },
    { name: 'Proveedores inactivos', value: (stats?.proveedores?.total || 0) - (stats?.proveedores?.activos || 0), color: COLORES_SERVICIOS[1] },
  ]

  const reservasPorEstado = (stats?.reservas?.porEstado || []).map((r, i) => ({
    name: r.estado,
    empresas: r._count.estado,
    color: COLORES_SERVICIOS[i % COLORES_SERVICIOS.length]
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted">Cargando datos...</p>
      </div>
    )
  }

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
          <StatsCard title="Estado de proveedores" className="card-hover">
            <PieChart data={serviciosActivos} />
          </StatsCard>

          <StatsCard title="Reservas por estado" className="card-hover">
            <BarChart
              data={reservasPorEstado}
              title="Reservas"
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
