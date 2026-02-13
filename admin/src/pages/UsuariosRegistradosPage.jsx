import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useEmpresasStore } from '@/store/empresasStore'

export function UsuariosRegistradosPage() {
  const [selectedEmpresa, setSelectedEmpresa] = useState('')
  const { empresas, getUsuariosByEmpresa } = useEmpresasStore()

  const usuarios = getUsuariosByEmpresa(selectedEmpresa)

  return (
    <div>
      <PageHeader title="Usuarios registrados" subtitle="Consulta información de los equipos de trabajo" />

      {/* Filter */}
      <div className="mb-6">
        <Select
          value={selectedEmpresa}
          onValueChange={setSelectedEmpresa}
        >
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

      {/* Users Table - Desktop */}
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
            {usuarios.map((usuario) => (
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
            {usuarios.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Users Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {usuarios.map((usuario) => (
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
        {usuarios.length === 0 && (
          <div className="text-center py-8 text-muted bg-white rounded-xl border border-cream">
            No hay usuarios registrados
          </div>
        )}
      </div>
    </div>
  )
}
