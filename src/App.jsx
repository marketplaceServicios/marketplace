import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { EmpresasPorServiciosPage } from '@/pages/EmpresasPorServiciosPage'
import { InfoProveedorPage } from '@/pages/InfoProveedorPage'
import { InfoRepresentantePage } from '@/pages/InfoRepresentantePage'
import { DocumentosProveedorPage } from '@/pages/DocumentosProveedorPage'
import { UsuariosRegistradosPage } from '@/pages/UsuariosRegistradosPage'
import { CrearEmpresaPage } from '@/pages/CrearEmpresaPage'
import { CrearRepresentantePage } from '@/pages/CrearRepresentantePage'
import { CrearServicioPage } from '@/pages/CrearServicioPage'
import { PerfilPage } from '@/pages/PerfilPage'
import { useAuthStore } from '@/store/authStore'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/empresas-por-servicios" element={<EmpresasPorServiciosPage />} />
        <Route path="/proveedor/:id" element={<InfoProveedorPage />} />
        <Route path="/proveedor/:id/representante" element={<InfoRepresentantePage />} />
        <Route path="/proveedor/:id/documentos" element={<DocumentosProveedorPage />} />
        <Route path="/usuarios-registrados" element={<UsuariosRegistradosPage />} />
        <Route path="/crear-empresa" element={<CrearEmpresaPage />} />
        <Route path="/crear-empresa/representante" element={<CrearRepresentantePage />} />
        <Route path="/crear-tipo-servicio" element={<CrearServicioPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
