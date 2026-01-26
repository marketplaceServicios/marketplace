import { PageHeader } from '@/components/layout/PageHeader'
import { TeamMemberCard } from '@/components/shared/TeamMemberCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEquipoStore } from '@/store/equipoStore'
import { roles } from '@/data/mockData'
import { Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function EquipoPage() {
  const navigate = useNavigate()

  const filtroRol = useEquipoStore((state) => state.filtroRol)
  const busqueda = useEquipoStore((state) => state.busqueda)
  const setFiltroRol = useEquipoStore((state) => state.setFiltroRol)
  const setBusqueda = useEquipoStore((state) => state.setBusqueda)
  const getMiembrosFiltrados = useEquipoStore(
    (state) => state.getMiembrosFiltrados
  )

  const miembros = getMiembrosFiltrados()

  const tabs = [
    { value: 'todos', label: 'Todos' },
    ...roles.map((rol) => ({ value: rol, label: rol }))
  ]

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`
  }

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipo"
        subtitle="Gestiona los miembros de tu equipo"
        action={
          <Button onClick={() => navigate('/equipo/crear')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo usuario
          </Button>
        }
      />

      {/* Filters */}
      <div className="space-y-4">
        <Tabs
          value={filtroRol}
          onValueChange={setFiltroRol}
          className="w-full"
        >
          <TabsList className="flex-wrap h-auto gap-2">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
          <Input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Team Grid */}
      {miembros.length === 0 ? (
        <div className="text-center py-12 text-slate">
          <p className="mb-4">No se encontraron miembros</p>
          <Button onClick={() => navigate('/equipo/crear')}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar miembro
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {miembros.map((miembro) => (
            <TeamMemberCard
              key={miembro.id}
              avatar={miembro.avatar}
              nombre={miembro.nombre}
              email={miembro.email}
              celular={miembro.celular}
              rol={miembro.rol}
              onEmail={() => handleEmail(miembro.email)}
              onCall={() => handleCall(miembro.celular)}
              onMore={() => navigate(`/equipo/crear?id=${miembro.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
