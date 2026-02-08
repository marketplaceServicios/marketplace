import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  Building2,
  Users,
  Plus,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import logo from '@/assets/images/logo/blanco.png'

const menuItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/empresas-por-servicios', icon: Building2, label: 'Empresas por servicios' },
  { path: '/usuarios-registrados', icon: Users, label: 'Usuarios registrados' },
  { path: '/crear-empresa', icon: Plus, label: 'Crear empresa' },
  { path: '/crear-tipo-servicio', icon: PlusCircle, label: 'Crear tipo de servicio' },
  { path: '/perfil', icon: User, label: 'Mi perfil' },
]

export function Sidebar() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-white shadow-lg hover:bg-primary-light transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-primary flex flex-col transition-transform duration-300 ease-in-out",
          "w-[260px] lg:w-[220px]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Close button - mobile only */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 p-1 text-white/70 hover:text-white"
          aria-label="Cerrar menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-6">
          <img
            src={logo}
            alt="Vive Silver"
            className="h-20 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent text-white shadow-md"
                    : "text-cream hover:bg-white/10 hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-white/10 w-full transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Cerrar sesion</span>
          </button>
        </div>
      </aside>
    </>
  )
}
