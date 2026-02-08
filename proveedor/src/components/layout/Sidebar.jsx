import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  FileText,
  Plus,
  Grid3X3,
  PlusCircle,
  Calendar,
  DollarSign,
  Users,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import logo from '@/assets/images/logos/blanco.png'

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Planes existentes', path: '/planes' },
  { icon: Plus, label: 'Crear plan', path: '/crear-plan' },
  { icon: Grid3X3, label: 'Categorias', path: '/categorias' },
  { icon: PlusCircle, label: 'Crear categorias', path: '/crear-categoria' },
  { icon: Calendar, label: 'Reservas activas', path: '/reservas' },
  {
    icon: DollarSign,
    label: 'Cotizaciones',
    path: '/cotizaciones',
    submenu: [
      { label: 'Pendientes', path: '/cotizaciones' },
      { label: 'Detalle', path: '/cotizaciones/1' }
    ]
  },
  { icon: Users, label: 'Equipo', path: '/equipo' },
  { icon: User, label: 'Mi perfil', path: '/perfil' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState(null)
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleSubmenu = (label) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-white shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-primary flex flex-col transition-transform duration-300",
          "w-[260px] lg:w-[220px]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Close Button - Mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <img
            src={logo}
            alt="Vive Silver"
            className="h-20 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          expandedMenu === item.label && "rotate-180"
                        )}
                      />
                    </button>
                    {expandedMenu === item.label && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subitem) => (
                          <li key={subitem.path}>
                            <NavLink
                              to={subitem.path}
                              onClick={() => setIsOpen(false)}
                              className={({ isActive }) =>
                                cn(
                                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
                                  isActive
                                    ? "bg-accent text-white"
                                    : "text-white/60 hover:text-white hover:bg-white/10"
                                )
                              }
                            >
                              <span>{subitem.label}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-accent text-white"
                          : "text-white/80 hover:bg-white/10"
                      )
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-danger hover:bg-white/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Cerrar sesion</span>
          </button>
        </div>
      </aside>
    </>
  )
}
