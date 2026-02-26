import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { LoginPage } from './pages/LoginPage'
import { CambiarContrasenaPage } from './pages/CambiarContrasenaPage'
import { DashboardPage } from './pages/DashboardPage'
import { PlanesPage } from './pages/PlanesPage'
import { CrearPlanPage } from './pages/CrearPlanPage'
import { EditarPlanPage } from './pages/EditarPlanPage'
import { CategoriasPage } from './pages/CategoriasPage'
import { ReservasPage } from './pages/ReservasPage'
import { CotizacionesPage } from './pages/CotizacionesPage'
import { TodasCotizacionesPage } from './pages/TodasCotizacionesPage'
import { DetalleCotizacionPage } from './pages/DetalleCotizacionPage'
import { IngresosPage } from './pages/IngresosPage'
import { EquipoPage } from './pages/EquipoPage'
import { CrearUsuarioPage } from './pages/CrearUsuarioPage'
import { PerfilPage } from './pages/PerfilPage'
import { useAuthStore } from './store/authStore'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const init = useAuthStore((state) => state.init)

  useEffect(() => { init() }, [])

  const mustChange = isAuthenticated && user?.mustChangePassword

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={mustChange ? '/cambiar-contrasena' : '/'} replace /> : <LoginPage />}
        />
        {/* Pantalla obligatoria de cambio de contraseña */}
        <Route
          path="/cambiar-contrasena"
          element={
            !isAuthenticated
              ? <Navigate to="/login" replace />
              : mustChange
                ? <CambiarContrasenaPage />
                : <Navigate to="/" replace />
          }
        />
        <Route
          element={
            !isAuthenticated
              ? <Navigate to="/login" replace />
              : mustChange
                ? <Navigate to="/cambiar-contrasena" replace />
                : <MainLayout />
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/planes" element={<PlanesPage />} />
          <Route path="/crear-plan" element={<CrearPlanPage />} />
          <Route path="/editar-plan/:id" element={<EditarPlanPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/ingresos" element={<IngresosPage />} />
          <Route path="/cotizaciones" element={<CotizacionesPage />} />
          <Route path="/cotizaciones/todas" element={<TodasCotizacionesPage />} />
          <Route path="/cotizaciones/:id" element={<DetalleCotizacionPage />} />
          <Route path="/equipo" element={<EquipoPage />} />
          <Route path="/equipo/crear" element={<CrearUsuarioPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
