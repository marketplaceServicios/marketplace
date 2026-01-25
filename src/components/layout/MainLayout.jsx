import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/store/authStore'

export function MainLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="min-h-screen transition-all duration-300 lg:ml-[220px]">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
