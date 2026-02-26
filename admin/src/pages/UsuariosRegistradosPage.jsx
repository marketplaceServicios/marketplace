import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useEmpresasStore } from '@/store/empresasStore'
import { api } from '@/lib/api'
import {
  Search, Plus, X, Users, Building2, UserCog, ShieldCheck,
  Mail, Phone, Briefcase, Calendar, ToggleLeft, ToggleRight, Pencil, Info
} from 'lucide-react'

/* ───────── helpers ───────── */
const getInitials = (name) =>
  (name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-CO')
}

const StatusBadge = ({ activo }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      activo ? 'bg-sage/10 text-sage' : 'bg-danger/10 text-danger'
    }`}
  >
    {activo ? 'Activo' : 'Inactivo'}
  </span>
)

/* ───────── TABS CONFIG ───────── */
const TABS = [
  { key: 'admins', label: 'Administradores', icon: ShieldCheck },
  { key: 'empresas', label: 'Empresas', icon: Building2 },
  { key: 'equipo', label: 'Equipo', icon: UserCog },
  { key: 'clientes', label: 'Clientes', icon: Users },
]

/* =================================================================
   MAIN PAGE
   ================================================================= */
export function UsuariosRegistradosPage() {
  const [activeTab, setActiveTab] = useState('admins')

  return (
    <div>
      <PageHeader
        title="Centro de usuarios"
        subtitle="Gestiona administradores, empresas, equipo y clientes"
      />

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-cream mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'admins' && <AdminsTab />}
      {activeTab === 'empresas' && <EmpresasTab />}
      {activeTab === 'equipo' && <EquipoTab />}
      {activeTab === 'clientes' && <ClientesTab />}
    </div>
  )
}

/* =================================================================
   TAB: ADMINISTRADORES
   ================================================================= */
function AdminsTab() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/admins')
      setAdmins(data)
    } catch (err) {
      console.error('Error cargando administradores:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return admins
    const q = search.toLowerCase()
    return admins.filter(
      (a) =>
        (a.nombre || '').toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q)
    )
  }, [admins, search])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.post('/admin/admins', formData)
      setFormData({ nombre: '', email: '', password: '' })
      setShowForm(false)
      await fetchAdmins()
    } catch (err) {
      console.error('Error creando administrador:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActivo = async (admin) => {
    try {
      setTogglingId(admin.id)
      await api.put(`/admin/admins/${admin.id}`, {
        nombre: admin.nombre,
        email: admin.email,
        activo: !admin.activo,
      })
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, activo: !a.activo } : a))
      )
    } catch (err) {
      alert(err.message || 'Error actualizando administrador')
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-muted">Cargando...</div>
  }

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            placeholder="Buscar administrador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'outline' : 'default'}
          size="sm"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4 mr-1" /> Cancelar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" /> Agregar administrador
            </>
          )}
        </Button>
      </div>

      {/* Inline form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl border border-cream shadow-sm p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-primary">Nuevo administrador</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            <Input
              placeholder="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              placeholder="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Guardando...' : 'Crear administrador'}
            </Button>
          </div>
        </form>
      )}

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-cream shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-cream/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha registro</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <Avatar className="h-8 w-8 bg-sage">
                    <AvatarFallback className="bg-sage text-white text-xs">
                      {getInitials(admin.nombre)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-primary">{admin.nombre}</TableCell>
                <TableCell className="text-muted">{admin.email}</TableCell>
                <TableCell>
                  <StatusBadge activo={admin.activo} />
                </TableCell>
                <TableCell className="text-muted">{formatDate(admin.createdAt)}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleActivo(admin)}
                    disabled={togglingId === admin.id}
                    className="text-muted hover:text-primary transition-colors disabled:opacity-50"
                    title={admin.activo ? 'Desactivar' : 'Activar'}
                  >
                    {admin.activo ? (
                      <ToggleRight className="w-5 h-5 text-sage" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-danger" />
                    )}
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted">
                  {search ? 'Sin resultados para la búsqueda' : 'No hay administradores registrados'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((admin) => (
          <div key={admin.id} className="bg-white rounded-xl border border-cream p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-sage">
                  <AvatarFallback className="bg-sage text-white text-sm">
                    {getInitials(admin.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-primary">{admin.nombre}</p>
                  <p className="text-sm text-muted">{admin.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleActivo(admin)}
                disabled={togglingId === admin.id}
                className="disabled:opacity-50"
              >
                {admin.activo ? (
                  <ToggleRight className="w-6 h-6 text-sage" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-danger" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <StatusBadge activo={admin.activo} />
              <span className="text-muted flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(admin.createdAt)}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted bg-white rounded-xl border border-cream">
            {search ? 'Sin resultados para la búsqueda' : 'No hay administradores registrados'}
          </div>
        )}
      </div>
    </div>
  )
}

/* =================================================================
   TAB: EMPRESAS
   ================================================================= */
function EmpresasTab() {
  const navigate = useNavigate()
  const { empresas, fetchEmpresas } = useEmpresasStore()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        await fetchEmpresas()
      } catch (err) {
        console.error('Error cargando empresas:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return empresas
    const q = search.toLowerCase()
    return empresas.filter(
      (e) =>
        (e.nombre || e.nombreEmpresa || '').toLowerCase().includes(q) ||
        (e.correo || e.email || '').toLowerCase().includes(q)
    )
  }, [empresas, search])

  if (loading) {
    return <div className="text-center py-12 text-muted">Cargando...</div>
  }

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            placeholder="Buscar empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button size="sm" onClick={() => navigate('/crear-empresa')}>
          <Plus className="w-4 h-4 mr-1" /> Agregar empresa
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-cream shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-cream/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Nombre empresa</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Planes activos</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((empresa) => {
              const nombre = empresa.nombre || empresa.nombreEmpresa || '—'
              const email = empresa.correo || empresa.email || '—'
              const telefono = empresa.telefono || '—'
              const activa = empresa.activa !== undefined ? empresa.activa : empresa.activo
              const planes = empresa._count?.planes ?? empresa.planesActivos ?? 0
              return (
                <TableRow key={empresa.id}>
                  <TableCell>
                    <Avatar className="h-8 w-8 bg-accent">
                      <AvatarFallback className="bg-accent text-white text-xs">
                        {getInitials(nombre)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium text-primary">{nombre}</TableCell>
                  <TableCell className="text-muted">{email}</TableCell>
                  <TableCell className="text-muted">{telefono}</TableCell>
                  <TableCell>
                    <StatusBadge activo={activa} />
                  </TableCell>
                  <TableCell className="text-muted">{planes}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => navigate(`/proveedor/${empresa.id}`)}
                      className="text-muted hover:text-accent transition-colors"
                      title="Editar empresa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted">
                  {search ? 'Sin resultados para la búsqueda' : 'No hay empresas registradas'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((empresa) => {
          const nombre = empresa.nombre || empresa.nombreEmpresa || '—'
          const email = empresa.correo || empresa.email || '—'
          const telefono = empresa.telefono || '—'
          const activa = empresa.activa !== undefined ? empresa.activa : empresa.activo
          const planes = empresa._count?.planes ?? empresa.planesActivos ?? 0
          return (
            <div key={empresa.id} className="bg-white rounded-xl border border-cream p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 bg-accent">
                  <AvatarFallback className="bg-accent text-white text-sm">
                    {getInitials(nombre)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary truncate">{nombre}</p>
                  <p className="text-sm text-muted truncate">{email}</p>
                </div>
                <button
                  onClick={() => navigate(`/proveedor/${empresa.id}`)}
                  className="shrink-0 text-muted hover:text-accent transition-colors"
                  title="Editar empresa"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-sm text-muted">
                <div className="flex items-center gap-2">
                  <StatusBadge activo={activa} />
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {telefono}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {planes} {planes === 1 ? 'plan' : 'planes'}
                </span>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted bg-white rounded-xl border border-cream">
            {search ? 'Sin resultados para la búsqueda' : 'No hay empresas registradas'}
          </div>
        )}
      </div>
    </div>
  )
}

/* =================================================================
   TAB: EQUIPO
   ================================================================= */
function EquipoTab() {
  const { empresas, fetchEmpresas } = useEmpresasStore()
  const [selectedEmpresa, setSelectedEmpresa] = useState('')
  const [equipo, setEquipo] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    proveedorId: '',
    nombre: '',
    cargo: '',
    email: '',
    telefono: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (empresas.length === 0) fetchEmpresas()
  }, [])

  const fetchEquipo = async (empresaId) => {
    try {
      setLoading(true)
      const params = empresaId ? `?proveedorId=${empresaId}` : ''
      const data = await api.get(`/admin/equipo${params}`)
      setEquipo(data)
    } catch (err) {
      console.error('Error cargando equipo:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedEmpresa && selectedEmpresa !== 'all') {
      fetchEquipo(selectedEmpresa)
    } else if (selectedEmpresa === 'all') {
      fetchEquipo('')
    }
  }, [selectedEmpresa])

  const filtered = useMemo(() => {
    if (!search.trim()) return equipo
    const q = search.toLowerCase()
    return equipo.filter(
      (m) =>
        (m.nombre || '').toLowerCase().includes(q) ||
        (m.cargo || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        (m.proveedor?.nombreEmpresa || '').toLowerCase().includes(q)
    )
  }, [equipo, search])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.post('/admin/equipo', formData)
      setFormData({ proveedorId: '', nombre: '', cargo: '', email: '', telefono: '' })
      setShowForm(false)
      if (selectedEmpresa && selectedEmpresa !== 'all') {
        await fetchEquipo(selectedEmpresa)
      } else if (selectedEmpresa === 'all') {
        await fetchEquipo('')
      }
    } catch (err) {
      console.error('Error creando miembro:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Info alert */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <svg className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
        <p>Los miembros de equipo son un registro informativo. <strong>No tienen acceso al portal</strong> ni pueden iniciar sesión.</p>
      </div>

      {/* Filters + Add */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Selecciona empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las empresas</SelectItem>
              {empresas.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id.toString()}>
                  {empresa.nombre || empresa.nombreEmpresa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Buscar miembro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'outline' : 'default'}
          size="sm"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4 mr-1" /> Cancelar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" /> Agregar miembro
            </>
          )}
        </Button>
      </div>

      {/* Inline form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl border border-cream shadow-sm p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-primary">Nuevo miembro de equipo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              value={formData.proveedorId}
              onValueChange={(val) => setFormData({ ...formData, proveedorId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id.toString()}>
                    {empresa.nombre || empresa.nombreEmpresa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            <Input
              placeholder="Cargo"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={saving || !formData.proveedorId}>
              {saving ? 'Guardando...' : 'Crear miembro'}
            </Button>
          </div>
        </form>
      )}

      {/* Prompt to select */}
      {!selectedEmpresa && !loading && (
        <div className="text-center py-12 text-muted bg-white rounded-xl border border-cream">
          Selecciona una empresa para ver su equipo de trabajo
        </div>
      )}

      {/* Loading */}
      {loading && <div className="text-center py-12 text-muted">Cargando...</div>}

      {/* Content */}
      {!loading && selectedEmpresa && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-cream shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-cream/50">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Empresa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((miembro) => (
                  <TableRow key={miembro.id}>
                    <TableCell>
                      <Avatar className="h-8 w-8 bg-sage">
                        <AvatarFallback className="bg-sage text-white text-xs">
                          {getInitials(miembro.nombre)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-primary">{miembro.nombre}</TableCell>
                    <TableCell className="text-muted">{miembro.cargo || '—'}</TableCell>
                    <TableCell className="text-muted">{miembro.email || '—'}</TableCell>
                    <TableCell className="text-muted">{miembro.telefono || '—'}</TableCell>
                    <TableCell className="text-muted">
                      {miembro.proveedor?.nombreEmpresa || '—'}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted">
                      {search
                        ? 'Sin resultados para la búsqueda'
                        : 'No hay miembros de equipo registrados'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((miembro) => (
              <div
                key={miembro.id}
                className="bg-white rounded-xl border border-cream p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 bg-sage">
                    <AvatarFallback className="bg-sage text-white text-sm">
                      {getInitials(miembro.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary truncate">{miembro.nombre}</p>
                    <p className="text-sm text-accent">{miembro.cargo || '—'}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted">
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> {miembro.email || '—'}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> {miembro.telefono || '—'}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> {miembro.proveedor?.nombreEmpresa || '—'}
                  </p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted bg-white rounded-xl border border-cream">
                {search
                  ? 'Sin resultados para la búsqueda'
                  : 'No hay miembros de equipo registrados'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* =================================================================
   TAB: CLIENTES
   ================================================================= */
function ClientesTab() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [togglingId, setTogglingId] = useState(null)

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/usuarios')
      setClientes(data)
    } catch (err) {
      console.error('Error cargando clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return clientes
    const q = search.toLowerCase()
    return clientes.filter(
      (c) =>
        (c.nombre || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.telefono || '').toLowerCase().includes(q)
    )
  }, [clientes, search])

  const handleToggle = async (cliente) => {
    try {
      setTogglingId(cliente.id)
      await api.patch(`/admin/usuarios/${cliente.id}/toggle`)
      setClientes((prev) =>
        prev.map((c) => (c.id === cliente.id ? { ...c, activo: !c.activo } : c))
      )
    } catch (err) {
      console.error('Error cambiando estado del cliente:', err)
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-muted">Cargando...</div>
  }

  return (
    <div className="space-y-4">
      {/* Info alert */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <svg className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
        <p>Los clientes se registran desde la web pública. <strong>No tienen acceso al portal de administración</strong> ni al portal de proveedores.</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted">
          {clientes.length} {clientes.length === 1 ? 'cliente registrado' : 'clientes registrados'}
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-cream shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-cream/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Reservas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha registro</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>
                  <Avatar className="h-8 w-8 bg-sage">
                    <AvatarFallback className="bg-sage text-white text-xs">
                      {getInitials(cliente.nombre)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-primary">{cliente.nombre || '—'}</TableCell>
                <TableCell className="text-muted">{cliente.email}</TableCell>
                <TableCell className="text-muted">{cliente.telefono || '—'}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cream text-sm font-medium text-primary">
                    {cliente._count?.reservas ?? 0}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge activo={cliente.activo} />
                </TableCell>
                <TableCell className="text-muted">{formatDate(cliente.createdAt)}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggle(cliente)}
                    disabled={togglingId === cliente.id}
                    className="text-muted hover:text-primary transition-colors disabled:opacity-50"
                    title={cliente.activo ? 'Desactivar' : 'Activar'}
                  >
                    {cliente.activo ? (
                      <ToggleRight className="w-5 h-5 text-sage" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-danger" />
                    )}
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted">
                  {search ? 'Sin resultados para la búsqueda' : 'No hay clientes registrados'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((cliente) => (
          <div key={cliente.id} className="bg-white rounded-xl border border-cream p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 bg-sage shrink-0">
                  <AvatarFallback className="bg-sage text-white text-sm">
                    {getInitials(cliente.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-primary truncate">{cliente.nombre || '—'}</p>
                  <p className="text-sm text-muted truncate">{cliente.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(cliente)}
                disabled={togglingId === cliente.id}
                className="shrink-0 disabled:opacity-50"
              >
                {cliente.activo ? (
                  <ToggleRight className="w-6 h-6 text-sage" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-danger" />
                )}
              </button>
            </div>
            <div className="space-y-1 text-sm text-muted mb-3">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> {cliente.telefono || '—'}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <StatusBadge activo={cliente.activo} />
              <div className="flex items-center gap-3">
                <span className="text-muted">
                  {cliente._count?.reservas ?? 0} {(cliente._count?.reservas ?? 0) === 1 ? 'reserva' : 'reservas'}
                </span>
                <span className="text-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(cliente.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted bg-white rounded-xl border border-cream">
            {search ? 'Sin resultados para la búsqueda' : 'No hay clientes registrados'}
          </div>
        )}
      </div>
    </div>
  )
}
