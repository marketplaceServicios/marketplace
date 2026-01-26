import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { PlanesPage } from './pages/PlanesPage'
import { CrearPlanPage } from './pages/CrearPlanPage'
import { CategoriasPage } from './pages/CategoriasPage'
import { CrearCategoriaPage } from './pages/CrearCategoriaPage'
import { ReservasPage } from './pages/ReservasPage'
import { CotizacionesPage } from './pages/CotizacionesPage'
import { DetalleCotizacionPage } from './pages/DetalleCotizacionPage'
import { EquipoPage } from './pages/EquipoPage'
import { CrearUsuarioPage } from './pages/CrearUsuarioPage'
import { PerfilPage } from './pages/PerfilPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/planes" element={<PlanesPage />} />
          <Route path="/crear-plan" element={<CrearPlanPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/crear-categoria" element={<CrearCategoriaPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/cotizaciones" element={<CotizacionesPage />} />
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
