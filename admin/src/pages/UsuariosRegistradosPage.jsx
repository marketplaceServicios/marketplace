import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useEmpresasStore } from '@/store/empresasStore'
import { api } from '@/lib/api'

export function UsuariosRegistradosPage() {
  const [selectedEmpresa, setSelectedEmpresa] = useState('')
  const [equipo, setEquipo] = useState([])
  const [loadingEquipo, setLoadingEquipo] = useState(false)
  const { empresas, fetchEmpresas } = useEmpresasStore()

  useEffect(() => {
    if (empresas.length === 0) fetchEmpresas()
  }, [])

  useEffect(() => {
    if (!selectedEmpresa || selectedEmpresa === 'all') {
      setEquipo([])
      return
    }
    setLoadingEquipo(true)
    api.get(`/proveedores/${selectedEmpresa}`)
      .then(data => {
        const miembros = (data.equipo || []).map(m => ({
          id: m.id,
          nombre: m.nombre,
          rol: m.cargo || '—',
          celular: m.telefono || '—',
          correo: m.email || '—',
          empresaId: m.proveedorId,
        }))
        setEquipo(miembros)
      })
      .catch(console.error)
      .finally(() => setLoadingEquipo(false))
  }, [selectedEmpresa])

  return (
    <div>
      <PageHeader title="Usuarios registrados" subtitle="Consulta información de los equipos de trabajo" />

      <div className="mb-6">
        <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Selecciona una empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las empresas</SelectItem>
            {empresas.map((empresa) => (
              <SelectItem key={empresa.id} value={empresa.id.toString()}>
                {empresa.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loadingEquipo && (
        <div className="text-center py-12 text-muted">Cargando equipo...</div>
      )}

      {!loadingEquipo && (!selectedEmpresa || selectedEmpresa === 'all') && (
        <div className="text-center py-12 text-muted bg-white rounded-xl border border-cream">
          Selecciona una empresa para ver su equipo de trabajo
        </div>
      )}

      {!loadingEquipo && selectedEmpresa && selectedEmpresa !== 'all' && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-cream shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-cream/50">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Nombre del empleado</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>Correo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipo.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <Avatar className="h-8 w-8 bg-sage">
                        <AvatarFallback className="bg-sage text-white text-xs">
                          {usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-primary">{usuario.nombre}</TableCell>
                    <TableCell className="text-muted">{usuario.rol}</TableCell>
                    <TableCell className="text-muted">{usuario.celular}</TableCell>
                    <TableCell className="text-muted">{usuario.correo}</TableCell>
                  </TableRow>
                ))}
                {equipo.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted">
                      Esta empresa no tiene miembros de equipo registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {equipo.map((usuario) => (
              <div key={usuario.id} className="bg-white rounded-xl border border-cream p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 bg-sage">
                    <AvatarFallback className="bg-sage text-white text-sm">
                      {usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-primary">{usuario.nombre}</p>
                    <p className="text-sm text-accent">{usuario.rol}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted">
                  <p>{usuario.celular}</p>
                  <p>{usuario.correo}</p>
                </div>
              </div>
            ))}
            {equipo.length === 0 && (
              <div className="text-center py-8 text-muted bg-white rounded-xl border border-cream">
                Esta empresa no tiene miembros de equipo registrados
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
